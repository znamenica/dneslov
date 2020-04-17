class DropEventKinds < ActiveRecord::Migration[4.2]
   def change
      drop_table( :event_kinds ) ;end;end
