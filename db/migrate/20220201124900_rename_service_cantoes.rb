class RenameServiceCantoes < ActiveRecord::Migration[5.2]
   def change
      rename_column :service_cantoes, :canto_id, :scriptum_id
      rename_table :service_cantoes, :service_scripta
   end
end
