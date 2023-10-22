class AddPlaceIdToEvents < ActiveRecord::Migration[5.2]
   def change
      change_table :events do |t|
         t.belongs_to :place
      end
   end
end
