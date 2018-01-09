class RetargetAdaptedNamesInNames < ActiveRecord::Migration[4.2]
   def change
      Name.where.not(bind_kind: 'несвязаное').where(bond_to_id: nil).update_all(bind_kind: 'несвязаное')

      names = Name.where(bind_kind: ['прилаженое', 'переложеное']).where.not(alphabeth_code: 'ру').where.not(bond_to_id: nil)
      names.each do |name|
         bond = name.bond_to
         kind = name.bind_kind
         name.bond_to_id = bond.bond_to_id
         name.root_id = name.id
         name.bind_kind = bond.bind_kind
         name.save!(validate: false)
         bond.bond_to = name
         bond.bind_kind = kind
         bond.root_id = name.id
         name.save!(validate: false) ;end;end;end
