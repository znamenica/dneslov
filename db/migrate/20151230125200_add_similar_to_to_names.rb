class AddSimilarToToNames < ActiveRecord::Migration[5.2]
   def change
      change_table :names do |t|
         t.belongs_to :similar_to
      end
   end
end
