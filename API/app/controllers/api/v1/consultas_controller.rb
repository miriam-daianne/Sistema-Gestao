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
      # app/controllers/api/v1/consultas_controller.rb
module Api
  module V1
    class ConsultasController < ApplicationController
      # ... outras ações ...
      
      def create_orcamento
        consulta = Consulta.new(
          paciente_id: params[:paciente_id],
          profissional_id: params[:comissoes].first[:profissional_id], # Ajuste conforme sua lógica
          tratamento_id: params[:tratamentos].first[:id], # Ajuste conforme sua lógica
          valor: params[:valor_total],
          data: Time.current,
          status: 'agendado'
        )
        
        if consulta.save
          # Aqui você pode criar registros adicionais para comissões, etc.
          render json: consulta, status: :created
        else
          render json: { errors: consulta.errors }, status: :unprocessable_entity
        end
      end
    end
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