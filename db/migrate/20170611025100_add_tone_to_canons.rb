class AddToneToCanons < ActiveRecord::Migration[5.2]
   def change
      change_table :services do |t|
         t.string :ref_title
         t.integer :tone
      end
   end
end
