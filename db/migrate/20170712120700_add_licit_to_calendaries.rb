class AddLicitToCalendaries < ActiveRecord::Migration[5.2]
   def change
      change_table :calendaries do |t|
         t.boolean :licit, default: false
      end
   end
end
