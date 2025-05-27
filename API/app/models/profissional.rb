class Profissional < ApplicationRecord
  has_many :consultas, dependent: :nullify
  
  validates :nome, presence: true

  # Set fixed commission percentage to 2.5%
  def pct_comissao
    2.5
  end

  # Prevent setting pct_comissao to any other value
  def pct_comissao=(value)
    # ignore any attempts to change commission percentage
  end
end
