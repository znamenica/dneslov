class RenameCantoesToScripta < ActiveRecord::Migration[5.2]
   def change
      rename_table :cantoes, :scripta
   end
end
