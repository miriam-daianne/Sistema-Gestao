class Tratamento < ApplicationRecord
  has_many :consultas
  
  validates :nome, presence: true
  validates :preco, :custo, numericality: { greater_than_or_equal_to: 0 }
  
  # Adiciona o campo status para identificar tratamentos concluídos/agendados
   rails generate migration AddStatusToTratamentos status:string
end