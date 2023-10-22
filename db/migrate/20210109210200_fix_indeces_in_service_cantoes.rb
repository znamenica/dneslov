class FixIndecesInServiceCantoes < ActiveRecord::Migration[5.2]
   def change
      change_table :service_cantoes do |t|
         t.index %i(service_id), if_not_exists: true
         t.index %i(canto_id), if_not_exists: true

         t.foreign_key :services, column: :service_id, primary_key: :id, on_delete: :cascade
         t.foreign_key :cantoes, column: :canto_id, primary_key: :id, on_delete: :cascade
      end
   end
end
