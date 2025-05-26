class Paciente < ApplicationRecord
  belongs_to :cliente, optional: true
  has_many :consultas, dependent: :destroy
  
  validates :nome, presence: true

  # Add attributes for new fields
  attribute :cpf, :string
  attribute :telefone, :string
  attribute :email, :string

  # Remove attribute :modo and :objetivo since they cause errors
end
