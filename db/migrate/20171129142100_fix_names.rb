class FixNames < ActiveRecord::Migration[5.2]
   safety_assured

   def change
      safety_assured do
         change_table :names do |t|
            t.integer :root_id
            t.string :bind_kind, null: false
            t.rename :similar_to_id, :bond_to_id
         end

         add_index :names, %i(root_id)
         add_index :names, %i(text alphabeth_code), unique: true
         add_index :names, %i(bond_to_id bind_kind)
      end
   end
end
