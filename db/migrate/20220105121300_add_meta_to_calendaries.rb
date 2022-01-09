class AddMetaToCalendaries < ActiveRecord::Migration[5.2]
   enable_extension "btree_gin"

   def change
      change_table :calendaries do |t|
         t.jsonb :meta

         t.index ["meta"], using: "gin"
      end
   end
end
