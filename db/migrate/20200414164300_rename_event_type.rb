class RenameEventType < ActiveRecord::Migration[4.2]
   def change
      rename_column(:events, :type, :kind) ;end;end
