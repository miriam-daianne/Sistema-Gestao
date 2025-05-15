#uso: rails generate migration AddStatusToConsultas status:string
class AddStatusToConsultas < ActiveRecord::Migration[7.0]
  def change
    add_column :consultas, :status, :string, default: 'agendado'
  end
end