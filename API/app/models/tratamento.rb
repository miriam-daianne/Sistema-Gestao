class Tratamento < ApplicationRecord
  has_many :consultas
  
  validates :nome, presence: true
  validates :preco, :custo, numericality: { greater_than_or_equal_to: 0 }

end