class Cliente < ApplicationRecord
  has_many :pacientes, dependent: :destroy
  
  validates :nome, presence: true
end