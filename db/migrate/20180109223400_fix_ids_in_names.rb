class FixIdsInNames < ActiveRecord::Migration[4.2]
   def change
      #Name.where(bind_kind: 'несвязаное').where.not(bond_to_id: nil).update_all(bond_to_id: nil)
      #Name.where(root_id: nil).update_all("root_id = id")
      end;end
