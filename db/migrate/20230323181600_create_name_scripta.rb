class CreateNameScripta < ActiveRecord::Migration[7.0]
   def change
      rename_table :names, :nomina

      create_table :names, id: :serial do |t|
         t.text :text, null: false, index: true
         t.string :language_code, null: false, index: true
         t.string :alphabeth_code, null: false, index: true

         t.timestamps null: false

         t.index %i(text alphabeth_code), unique: true
      end

      change_table :nomina do |t|
         t.references :name, index: true

         t.change :bond_to_id, :bigint
         t.change :root_id, :bigint
      end

      rename_column :memory_names, :name_id, :nomen_id
    end
end
