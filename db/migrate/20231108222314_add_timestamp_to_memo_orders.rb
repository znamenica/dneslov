class AddTimestampToMemoOrders < ActiveRecord::Migration[7.0]
   def change
      add_column :memo_orders, :updated_at, :timestamp
      add_column :memo_orders, :created_at, :timestamp
   end
end
