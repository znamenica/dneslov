class RenameMemoriesNames< ActiveRecord::Migration[5.2]
   def change
      rename_table :memories_names, :memory_names
   end
end
