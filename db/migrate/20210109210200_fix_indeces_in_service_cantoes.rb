class FixIndecesInServiceCantoes < ActiveRecord::Migration[5.2]
   def change
      change_table :service_cantoes do |t|
         t.index %i(service_id)
         t.index %i(canto_id) ;end;end;end
