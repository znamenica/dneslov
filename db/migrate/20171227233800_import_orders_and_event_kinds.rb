class ImportOrdersAndEventKinds < ActiveRecord::Migration[4.2]
   def up
      begin
         ::Tasks.import_orders
         ::Tasks.import_event_kinds
      rescue Exception ;end;end
   
   def down
      ::Order.destroy_all
      ::EventKind.destroy_all ;end;end
