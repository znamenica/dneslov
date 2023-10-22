class FixIndecesInSubjects < ActiveRecord::Migration[5.2]
   def change
      change_table :subjects do |t|
         t.index %i(kind_code key id)
         t.index %i(kind_code key)
      end
   end
end
