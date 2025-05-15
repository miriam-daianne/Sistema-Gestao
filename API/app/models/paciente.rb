class Paciente < ApplicationRecord
  belongs_to :cliente, optional: true
  has_many :consultas, dependent: :destroy
  
  validates :nome, presence: true
end