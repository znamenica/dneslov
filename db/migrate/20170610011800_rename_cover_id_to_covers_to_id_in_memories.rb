class RenameCoverIdToCoversToIdInMemories < ActiveRecord::Migration[5.2]
   def change
      change_table :memories do |t|
         t.rename :cover_id, :covers_to_id
      end
   end
end
