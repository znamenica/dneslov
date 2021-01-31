class FixIndecesInServiceCantoes < ActiveRecord::Migration[5.2]
   def change
      change_table :service_cantoes do |t|
         t.index %i(service_id)
         t.index %i(canto_id)

         t.foreign_key :services, column: :service_id, primary_key: :id, on_delete: :cascade
         t.foreign_key :cantoes, column: :canto_id, primary_key: :id, on_delete: :cascade ;end;end;end
