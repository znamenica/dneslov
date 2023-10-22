class AddTypeToDescriptions < ActiveRecord::Migration[5.2]
   def change
      change_table :descriptions do |t|
         t.string :type
      end
   end
end
