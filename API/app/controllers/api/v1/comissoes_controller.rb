module Api
  module V1
    class ComissoesController < ApplicationController
      def index
        begin
          dados = Consulta.joins(:profissional)
                  .group('profissionais.id')
                  .select('profissionais.id AS profissional_id, SUM(consultas.valor) AS total_recebido')
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
        rescue => e
          Rails.logger.error "Error in ComissoesController#index: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
end