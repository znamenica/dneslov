class CreateMemories < ActiveRecord::Migration[5.2]
   def change
      create_table :memories do |t|
         t.string :short_name, index: { unique: true }

         t.timestamps null: false
      end
   end
end
