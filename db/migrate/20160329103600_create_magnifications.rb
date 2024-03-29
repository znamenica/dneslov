class CreateMagnifications < ActiveRecord::Migration[5.2]
   def change
      create_table :magnifications do |t|
         t.string  :text, null: false
         t.integer :language_code, null: false

         t.timestamps null: false

         t.index %i(text language_code), unique: true
      end
   end
end
