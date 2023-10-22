class AddModifierToNomina < ActiveRecord::Migration[7.0]
   def change
      change_table :nomina do |t|
         t.string :modifier, index: true
      end
   end
end
