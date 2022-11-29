class RemoveMagnifications < ActiveRecord::Migration[5.2]
   def change
      drop_table :magnifications
   end
end
