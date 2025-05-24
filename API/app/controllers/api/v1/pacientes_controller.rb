module Api
  module V1
    class PacientesController < ApplicationController
      def index
        # Garante que temos os relacionamentos carregados
        pacientes = Paciente.left_joins(consultas: :profissional)
                          .select(
                            'pacientes.id',
                            'pacientes.nome',
                            'MAX(consultas.data) AS ultima_consulta',
                            'COALESCE(SUM(consultas.valor), 0) AS vl_total',
                            'pacientes.objetivo',
                            'consultas.modo',
                            'consultas.returns_count AS retornos',
                            'profissionais.nome AS profissional_nome'
                          )
                          .group('pacientes.id', 'pacientes.nome', 'pacientes.objetivo', 'consultas.modo', 'consultas.returns_count', 'profissionais.nome')

        render json: pacientes
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
        params.require(:paciente).permit(:nome, :cpf, :telefone, :email, :nascimento, :objetivo)
      end
    end
  end
end