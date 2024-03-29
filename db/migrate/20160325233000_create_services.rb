class CreateServices < ActiveRecord::Migration[5.2]
   def change
      create_table :services do |t|
         t.string  :name, null: false
         t.integer :language_code, null: false
         t.belongs_to :memory, null: false

         t.string  :type
         t.timestamps null: false

         t.index %i(name language_code), unique: true
      end
   end
end
