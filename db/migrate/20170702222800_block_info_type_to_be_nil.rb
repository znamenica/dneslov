class BlockInfoTypeToBeNil < ActiveRecord::Migration[5.2]
   def change
      change_column_null(:services, :info_type, false)
      change_column_null(:links, :info_type, false)
   end
end
