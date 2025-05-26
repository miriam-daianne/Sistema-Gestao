module Api
  module V1
    class PacientesController < ApplicationController
      def index
        begin
          # Garante que temos os relacionamentos carregados
          query = Paciente.left_joins(consultas: :profissional)
                            .select(
                              'pacientes.id',
                              'pacientes.nome',
                              'MAX(consultas.data) AS ultima_consulta',
                              'COALESCE(SUM(consultas.valor), 0) AS vl_total',
                              'consultas.modo',
                              'consultas.returns_count AS retornos',
                              'profissionais.nome AS profissional_nome'
                            )
                            .group('pacientes.id', 'pacientes.nome', 'consultas.modo', 'consultas.returns_count', 'profissionais.nome')

          Rails.logger.debug "Generated SQL: #{query.to_sql}"

          pacientes = query

          # Convert ActiveRecord::Relation to array of hashes for proper JSON serialization
          render json: pacientes.as_json
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
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
        params.require(:paciente).permit(:nome, :objetivo, :modo, :cliente_id)
      end
    end
  end
end