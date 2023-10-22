class CreateReadings < ActiveRecord::Migration[5.2]
   def change
      create_table :readings do |t|
         t.string :year_date, index: true
         t.string :abbreviation, index: true
         t.string :kind, index: true

         t.index %i(year_date abbreviation), unique: true
         t.index %i(year_date abbreviation kind)
      end
   end
end
