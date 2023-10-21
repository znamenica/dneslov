class AddUniqueIndexInNomina < ActiveRecord::Migration[7.0]
   disable_ddl_transaction!

   def change
      add_index :memory_names, %i(memory_id nomen_id state_code), unique: true, algorithm: :concurrently
   end
end
