# config/application.rb
require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module APIBlueZoneClinic
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
  end
end

# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::CORS do
  allow do
    origins '*'
    resource '/api/*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
  end
end

# app/models/cliente.rb
class Cliente < ApplicationRecord
  has_many :pacientes, dependent: :destroy
  
  validates :nome, presence: true
end

# app/models/tratamento.rb
class Tratamento < ApplicationRecord
  has_many :consultas
  
  validates :nome, presence: true
  validates :preco, :custo, numericality: { greater_than_or_equal_to: 0 }
  
  # Adicionar o campo status para identificar tratamentos concluídos/agendados
  # rails generate migration AddStatusToTratamentos status:string
end

# app/models/profissional.rb
class Profissional < ApplicationRecord
  has_many :consultas, dependent: :nullify
  
  validates :nome, presence: true
  validates :pct_comissao, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
end

# app/models/paciente.rb
class Paciente < ApplicationRecord
  belongs_to :cliente, optional: true
  has_many :consultas, dependent: :destroy
  
  validates :nome, presence: true
end

# app/models/consulta.rb
class Consulta < ApplicationRecord
  belongs_to :paciente
  belongs_to :profissional
  belongs_to :tratamento
  
  validates :data, presence: true
  validates :valor, numericality: { greater_than_or_equal_to: 0 }
  validates :modo, presence: true
  validates :returns_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  
  # Adicionar campo status para refletir o status de tratamentos (concluído/agendado)
   rails generate migration AddStatusToConsultas status:string
  
  scope :recentes, -> { order(data: :desc) }
  scope :do_mes_atual, -> { where(data: Time.current.beginning_of_month..Time.current.end_of_month) }
  scope :da_semana_atual, -> { where(data: Time.current.beginning_of_week..Time.current.end_of_week) }
  scope :concluidas, -> { where(status: 'concluido') }
  scope :agendadas, -> { where(status: 'agendado') }
end

# app/controllers/api/v1/clientes_controller.rb
module Api 
  module V1
    class ClientesController < ApplicationController
      def index
        render json: Cliente.all.select(:id, :nome)
      end
      
      def create
        cliente = Cliente.new(cliente_params)
        
        if cliente.save
          render json: cliente, status: :created
        else
          render json: { errors: cliente.errors }, status: :unprocessable_entity
        end
      end
      
      private
      
      def cliente_params
        params.require(:cliente).permit(:nome)
      end
    end
  end
end

# app/controllers/api/v1/tratamentos_controller.rb
module Api
  module V1
    class TratamentosController < ApplicationController
      def index
        tratamentos = Tratamento.select(:id, :nome, :preco, :custo, :status)
        render json: tratamentos
      end
      
      def create
        tratamento = Tratamento.new(tratamento_params)
        
        if tratamento.save
          render json: tratamento, status: :created
        else
          render json: { errors: tratamento.errors }, status: :unprocessable_entity
        end
      end
      
      def stats
        total = Consulta.count
        concluidos = Consulta.concluidas.count
        agendados = Consulta.agendadas.count
        
        render json: {
          total: total,
          concluidos: concluidos,
          agendados: agendados
        }
      end
      
      private
      
      def tratamento_params
        params.require(:tratamento).permit(:nome, :preco, :custo, :status)
      end
    end
  end
end

# app/controllers/api/v1/profissionais_controller.rb
module Api
  module V1
    class ProfissionaisController < ApplicationController
      def index
        profissionais = Profissional.select(:id, :nome, :pct_comissao)
        render json: profissionais
      end
      
      def create
        profissional = Profissional.new(profissional_params)
        
        if profissional.save
          render json: profissional, status: :created
        else
          render json: { errors: profissional.errors }, status: :unprocessable_entity
        end
      end
      
      private
      
      def profissional_params
        params.require(:profissional).permit(:nome, :pct_comissao)
      end
    end
  end
end

# app/controllers/api/v1/pacientes_controller.rb
module Api
  module V1
    class PacientesController < ApplicationController
      def index
        registros = Paciente.joins(consultas: :profissional)
                           .select('pacientes.id, pacientes.nome, MAX(consultas.data) AS ultima_consulta',
                                  'SUM(consultas.valor) AS vl_total',
                                  'pacientes.objetivo',
                                  'consultas.modo',
                                  'consultas.returns_count AS retornos',
                                  'profissionais.nome AS profissional_nome')
                           .group('pacientes.id', 'consultas.modo', 'consultas.returns_count', 'profissionais.nome', 'pacientes.objetivo')

        resultados = registros.map do |r|
          {
            id: r.id,
            nome: r.nome,
            ultima_consulta: r.ultima_consulta,
            vl_total: r.vl_total,
            objetivo: r.objetivo,
            modo: r.modo,
            retornos: r.retornos,
            profissional: r.profissional_nome
          }
        end

        render json: resultados
      end
      
      def create
        paciente = Paciente.new(paciente_params)
        
        if paciente.save
          render json: paciente, status: :created
        else
          render json: { errors: paciente.errors }, status: :unprocessable_entity
        end
      end
      
      private
      
      def paciente_params
        params.require(:paciente).permit(:nome, :objetivo, :cliente_id)
      end
    end
  end
end

# app/controllers/api/v1/consultas_controller.rb
module Api
  module V1
    class ConsultasController < ApplicationController
      def index
        consultas = if params[:periodo] == 'semana'
                      Consulta.da_semana_atual
                    elsif params[:periodo] == 'mes'
                      Consulta.do_mes_atual
                    else
                      Consulta.all
                    end
                    
        consultas = consultas.includes(:paciente, :tratamento, :profissional)
                            .order(data: :desc)
                            .page(params[:page] || 1)
                            .per(10)
        
        resultados = consultas.map do |c|
          {
            id: c.id,
            data: c.data,
            paciente: c.paciente.nome,
            tratamento: c.tratamento.nome,
            valor: c.valor,
            profissional: c.profissional.nome,
            status: c.status
          }
        end
        
        render json: {
          consultas: resultados,
          meta: {
            current_page: consultas.current_page,
            total_pages: consultas.total_pages,
            total_count: consultas.total_count
          }
        }
      end
      
      def create
        consulta = Consulta.new(consulta_params)
        
        if consulta.save
          render json: consulta, status: :created
        else
          render json: { errors: consulta.errors }, status: :unprocessable_entity
        end
      end
      
      def dashboard
        # Dados para o dashboard com estatísticas
        total_tratamentos = Consulta.count
        concluidos = Consulta.concluidas.count
        agendados = Consulta.agendadas.count
        
        receita_total = Consulta.sum(:valor)
        total_comissoes = calcular_total_comissoes
        
        media_por_tratamento = receita_total / [total_tratamentos, 1].max
        
        render json: {
          total_tratamentos: {
            valor: total_tratamentos,
            concluidos: concluidos,
            agendados: agendados
          },
          receita: {
            total: receita_total,
            comissoes: total_comissoes
          },
          media_tratamento: {
            valor: media_por_tratamento,
            periodo: "Último mês"
          }
        }
      end
      
      private
      
      def consulta_params
        params.require(:consulta).permit(:data, :valor, :modo, :returns_count, :paciente_id, :profissional_id, :tratamento_id, :status)
      end
      
      def calcular_total_comissoes
        Consulta.joins(:profissional)
               .sum('consultas.valor * profissionais.pct_comissao / 100')
      end
    end
  end
end

# app/controllers/api/v1/comissoes_controller.rb
module Api
  module V1
    class ComissoesController < ApplicationController
      def index
        dados = Consulta.joins(:profissional)
                       .group(:profissional_id)
                       .select('profissional_id, SUM(valor) AS total_recebido')
                       .map do |row|
          prof = Profissional.find(row.profissional_id)
          total = row.total_recebido.to_f
          valor_comissao = total * prof.pct_comissao / 100
          
          {
            profissional: prof.nome,
            percentual_comissao: prof.pct_comissao,
            vl_total_consultas: total,
            vl_comissao: valor_comissao,
            total_comissao: valor_comissao + (total * 0.025)
          }
        end
        
        render json: dados
      end
    end
  end
end

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :clientes, only: [:index, :create]
      resources :tratamentos, only: [:index, :create] do
        collection do
          get :stats
        end
      end
      resources :profissionais, only: [:index, :create]
      resources :pacientes, only: [:index, :create]
      resources :consultas, only: [:index, :create] do
        collection do
          get :dashboard
        end
      end
      resources :comissoes, only: [:index]
    end
  end
end

# Migration para adicionar campos necessários - Execute no terminal:

 rails generate migration AddStatusToConsultas status:string
 class AddStatusToConsultas < ActiveRecord::Migration[7.0]
  def change
     add_column :consultas, :status, :string, default: 'agendado'
   end
 end

 rails generate migration AddStatusToTratamentos status:string
 class AddStatusToTratamentos < ActiveRecord::Migration[7.0]
   def change
     add_column :tratamentos, :status, :string, default: 'ativo'
   end
 end

 rails generate migration AddClienteIdToPacientes cliente:references
 class AddClienteIdToPacientes < ActiveRecord::Migration[7.0]
   def change
     add_reference :pacientes, :cliente, foreign_key: true, null: true
   end
 end