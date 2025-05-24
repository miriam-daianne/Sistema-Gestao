class AddStatusToTratamentos < ActiveRecord::Migration[8.0]
  def change
    add_column :tratamentos, :status, :string, default: 'ativo', null: false
  end
end
