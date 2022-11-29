class CreateChants < ActiveRecord::Migration[5.2]
   def change
      create_table :chants do |t|
         t.string  :text, null: false
         t.string  :prosomeion_title
         t.integer :language_code, null: false
         t.integer :tone

         t.string  :type
         t.timestamps null: false
         t.index %i(text language_code), unique: true
      end
   end
end
