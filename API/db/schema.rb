# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_26_000000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "clientes", force: :cascade do |t|
    t.string "nome"
    t.string "email"
    t.string "telefone"
    t.string "endereco"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "consultas", force: :cascade do |t|
    t.integer "paciente_id"
    t.integer "profissional_id"
    t.integer "tratamento_id"
    t.date "data"
    t.decimal "valor", precision: 10, scale: 2
    t.string "modo"
    t.integer "returns_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "agendado", null: false
  end

  create_table "pacientes", force: :cascade do |t|
    t.string "nome"
    t.string "cpf"
    t.string "telefone"
    t.string "email"
    t.integer "cliente_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cliente_id"], name: "index_pacientes_on_cliente_id"
  end

  create_table "profissionais", force: :cascade do |t|
    t.string "nome"
    t.string "especialidade"
    t.decimal "pct_comissao", precision: 5, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tratamentos", force: :cascade do |t|
    t.string "nome"
    t.decimal "preco", precision: 10, scale: 2
    t.decimal "custo", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "ativo", null: false
  end
end
