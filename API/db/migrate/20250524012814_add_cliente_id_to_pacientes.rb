  class AddClienteIdToPacientes < ActiveRecord::Migration[8.0]
   def change
      unless column_exists?(:pacientes, :cliente_id)
       add_column :pacientes, :cliente_id, :integer
   
      end
    end
  end

