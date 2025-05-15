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
