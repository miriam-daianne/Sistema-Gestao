class CreateClientes < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:clientes)
      create_table :clientes do |t|
        t.string :nome
        t.string :email
        t.string :telefone

        t.timestamps
      end
    end
  end
end
