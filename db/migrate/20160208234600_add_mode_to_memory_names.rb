class AddModeToMemoryNames < ActiveRecord::Migration[5.2]
   def change
      change_table :memory_names do |t|
         t.integer :mode
      end
   end
end
