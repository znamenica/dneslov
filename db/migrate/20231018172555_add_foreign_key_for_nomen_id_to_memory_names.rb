class AddForeignKeyForNomenIdToMemoryNames < ActiveRecord::Migration[7.0]
   def change
      add_foreign_key :memory_names, :nomina, on_delete: :cascade, if_not_exists: true
   end
end
