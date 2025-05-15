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