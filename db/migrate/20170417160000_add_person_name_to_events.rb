class AddPersonNameToEvents < ActiveRecord::Migration[5.2]
   def change
      change_table :events do |t|
         t.string :person_name
      end
   end
end
