class AddSignificanceToOrders < ActiveRecord::Migration[7.0]
   def change
      change_table :orders do |t|
         # 0 means highest, 32767 lowest
         t.column :significance, :smallint, index: true, default: 32767, null: false
      end
   end
end
