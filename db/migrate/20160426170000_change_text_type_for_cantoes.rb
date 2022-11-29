class ChangeTextTypeForCantoes < ActiveRecord::Migration[5.2]
   def change
      change_column :cantoes, :text, :text
   end
end
