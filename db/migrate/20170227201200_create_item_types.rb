class CreateItemTypes < ActiveRecord::Migration[5.2]
   def change
      create_table :item_types do |t|
         t.timestamps null: false
      end
   end
end
