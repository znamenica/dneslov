class RenameMemosToMemoes < ActiveRecord::Migration[5.2]
   def change
      rename_table :memos, :memoes
   end
end
