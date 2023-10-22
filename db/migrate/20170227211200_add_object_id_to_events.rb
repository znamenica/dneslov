class AddObjectIdToEvents < ActiveRecord::Migration[5.2]
   def change
      change_table :events do |t|
         t.integer :object_id
      end
   end
end
