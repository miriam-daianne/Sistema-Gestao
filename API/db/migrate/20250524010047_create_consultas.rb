class CreateConsultas < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:consultas)
      create_table :consultas do |t|
        t.integer :paciente_id
        t.integer :profissional_id
        t.integer :tratamento_id
        t.date :data
        t.decimal :valor, precision: 10, scale: 2
        t.string :modo
        t.integer :returns_count, default: 0

        t.timestamps
      end
    end
  end
end
