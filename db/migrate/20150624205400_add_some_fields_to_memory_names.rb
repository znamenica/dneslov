class AddSomeFieldsToMemoryNames < ActiveRecord::Migration[5.2]
   def change
      change_table :memory_names do |t|
         t.integer :state
         t.integer :feasibly, default: 0, null: false
         t.timestamp :created_at, null: false
         t.timestamp :updated_at, null: false
      end
   end
end
