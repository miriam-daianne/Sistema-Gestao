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