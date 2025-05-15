class Profissional < ApplicationRecord
  has_many :consultas, dependent: :nullify
  
  validates :nome, presence: true
  validates :pct_comissao, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
end