class CreateProfissionais < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:profissionais)
      create_table :profissionais do |t|
        t.string :nome
        t.string :especialidade
        t.decimal :pct_comissao, precision: 5, scale: 2
        
        t.timestamps
      end
    end
  end
end
