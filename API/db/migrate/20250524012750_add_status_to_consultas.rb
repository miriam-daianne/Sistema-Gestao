class AddStatusToConsultas < ActiveRecord::Migration[8.0]
  def change
    add_column :consultas, :status, :string, default: 'agendado', null: false
  end
end
