 #uso: rails generate migration AddStatusToTratamentos status:string
class AddStatusToTratamentos < ActiveRecord::Migration[7.0]
  def change
    add_column :tratamentos, :status, :string, default: 'ativo'
  end
end