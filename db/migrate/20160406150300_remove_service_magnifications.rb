class RemoveServiceMagnifications < ActiveRecord::Migration[5.2]
   def change
      drop_table :service_magnifications
   end
end
