#uso: rails generate migration AddClienteIdToPacientes cliente:references
class AddClienteIdToPacientes < ActiveRecord::Migration[7.0]
  def change
    add_reference :pacientes, :cliente, foreign_key: true, null: true
  end
end