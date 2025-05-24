class CreatePacientes < ActiveRecord::Migration[8.0]
  def change
      unless table_exists?(:pacientes)
      create_table :pacientes do |t|
        t.integer :cliente_id
        t.string :nome
        t.string :objetivo
        t.string :modo

        t.timestamps
      end
    end  
  end
end
