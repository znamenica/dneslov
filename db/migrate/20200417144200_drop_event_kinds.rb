class DropEventKinds < ActiveRecord::Migration[5.2]
   def change
      drop_table( :event_kinds )
   end
end
