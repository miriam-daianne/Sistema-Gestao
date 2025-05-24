class CreateTratamentos < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:tratamentos)
      create_table :tratamentos do |t|
        t.string :nome
        t.decimal :preco, precision: 10, scale: 2
        t.decimal :custo, precision: 10, scale: 2

        t.timestamps
      end
    end
  end
end
