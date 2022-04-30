class RetypeKindInReadings < ActiveRecord::Migration[5.2]
   def change
      change_column :readings, :kind, :integer, using: 'kind::integer'
   end
end
