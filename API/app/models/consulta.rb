class Consulta < ApplicationRecord
  belongs_to :paciente
  belongs_to :profissional
  belongs_to :tratamento
  
  validates :data, presence: true
  validates :valor, numericality: { greater_than_or_equal_to: 0 }
  validates :modo, presence: true
  validates :returns_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  
  # Adicionar campo status para refletir o status de tratamentos (concluído/agendado)
   rails generate migration AddStatusToConsultas status:string
  
  scope :recentes, -> { order(data: :desc) }
  scope :do_mes_atual, -> { where(data: Time.current.beginning_of_month..Time.current.end_of_month) }
  scope :da_semana_atual, -> { where(data: Time.current.beginning_of_week..Time.current.end_of_week) }
  scope :concluidas, -> { where(status: 'concluido') }
  scope :agendadas, -> { where(status: 'agendado') }
end