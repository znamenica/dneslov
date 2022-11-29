class ConvertJsonType < ActiveRecord::Migration[5.2]
   def up
      change_column(:subjects, :meta, :jsonb)
   end

   def down
      change_column(:subjects, :meta, :json)
   end
end
