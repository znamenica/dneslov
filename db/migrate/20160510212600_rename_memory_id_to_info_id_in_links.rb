class RenameMemoryIdToInfoIdInLinks < ActiveRecord::Migration[5.2]
   def change
      rename_column :links, :memory_id, :info_id
      add_column :links, :info_type, :string
   end
end
