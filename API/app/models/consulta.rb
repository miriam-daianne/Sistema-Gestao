class Consulta < ApplicationRecord
  self.table_name = "consultas" # Explícito para evitar ambiguidades
  
  # Garanta que os belongs_to são opcionais se necessário
  belongs_to :paciente, optional: true
  belongs_to :profissional, optional: true
  belongs_to :tratamento, optional: true
  
  validates :data, presence: true
  validates :valor, numericality: { greater_than_or_equal_to: 0 }
  validates :modo, presence: true
  validates :returns_count, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0
  }
  
  # Adicione após confirmar que a coluna existe
  validates :status, inclusion: { in: ['agendado', 'concluido', 'cancelado'] }, allow_nil: true

  # Scopes otimizados
  scope :recentes, -> { order(data: :desc) }
  scope :do_mes_atual, -> {
    where(data: Time.current.beginning_of_month..Time.current.end_of_month)
  }
  scope :da_semana_atual, -> {
    where(data: Time.current.beginning_of_week..Time.current.end_of_week)
  }
  scope :concluidas, -> { where(status: 'concluido') }
  scope :agendadas, -> { where(status: 'agendado') }
end