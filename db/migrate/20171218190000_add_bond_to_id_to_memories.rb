class AddBondToIdToMemories < ActiveRecord::Migration[5.2]
   def change
      change_table :memories do |t|
         t.integer :bond_to_id
         t.remove :view_string

         t.index %i(bond_to_id)
      end
   end
end
