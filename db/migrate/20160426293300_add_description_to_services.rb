class AddDescriptionToServices < ActiveRecord::Migration[5.2]
   def change
      change_table :services do |t|
         t.string :gospel
         t.string :apostle
         t.string :author
         t.string :source
         t.string :description
      end
   end
end
