class AddUniqueIndexToNomina < ActiveRecord::Migration[7.0]
   disable_ddl_transaction!

   def change
      add_index :nomina, %i(bond_to_id name_id), unique: true, algorithm: :concurrently
   end
end
