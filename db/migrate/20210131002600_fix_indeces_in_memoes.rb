class FixIndecesInMemoes < ActiveRecord::Migration[5.2]
   def change
      change_table :memoes do |t|
         t.index %i(event_id bond_to_id id)
         t.index %i(bind_kind_code)
         t.index %i(calendary_id)
         t.index %i(event_id)
         t.index %i(bond_to_id) ;end;end;end
