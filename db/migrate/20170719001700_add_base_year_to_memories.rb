class AddBaseYearToMemories < ActiveRecord::Migration[5.2]
   def change
      change_table :memories do |t|
         t.integer :base_year, index: true
      end
   end
end
