module Api
  module V1
    class ConsultasController < ApplicationController
      def index
        consultas = Consulta.all
        consultas = consultas.where(status: params[:status]) if params[:status].present?
        consultas = if params[:periodo] == 'semana'
                      consultas.da_semana_atual
                    elsif params[:periodo] == 'mes'
                      consultas.do_mes_atual
                    else
                      consultas
                    end
        consultas = consultas.includes(:paciente, :tratamento, :profissional)
                            .order(data: :desc)
        resultados = consultas.map do |c|
          {
            id: c.id,
            data: c.data,
            paciente: c.paciente&.nome || 'N/A',
            tratamento: c.tratamento&.nome || 'N/A',
            valor: c.valor,
            profissional: c.profissional&.nome || 'N/A',
            status: c.status
          }
        end
        render json: {
          consultas: resultados,
          meta: {
            current_page: 1,
            total_pages: 1,
            total_count: consultas.size
          }
        }
      end

      def create
        consulta = Consulta.new(consulta_params)
        if consulta.save
          render json: consulta, status: :created
        else
          Rails.logger.debug "Consulta save errors: #{consulta.errors.full_messages.join(', ')}"
          render json: { errors: consulta.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def create_orcamento
        consulta = Consulta.new(
          paciente_id: params[:paciente_id],
          profissional_id: params[:comissoes].first[:profissional_id], # Ajuste conforme sua lógica
          tratamento_id: params[:tratamentos].first[:id], # Ajuste conforme sua lógica
          valor: params[:valor_total],
          data: Time.current,
          status: 'orcamento'
        )
        if consulta.save
          # Aqui você pode criar registros adicionais para comissões, etc.
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
        params.require(:consulta).permit(
          :data, :valor, :modo, :returns_count, :paciente_id, :profissional_id, :tratamento_id, :status,
          tratamento_attributes: [:id, :nome, :preco, :custo, :quantidade, :_destroy],
          comissoes_attributes: [:id, :profissional_id, :valor, :percentual, :_destroy]
        )
      end

      def calcular_total_comissoes
        Consulta.joins(:profissional)
                .sum('consultas.valor * profissionais.pct_comissao / 100')
      end
    end
  end
end
