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