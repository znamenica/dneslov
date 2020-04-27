class RenameBindKind < ActiveRecord::Migration[4.2]
   safety_assured

   def up
      rename_column :memoes, :bind_kind, :bind_kind_code end;end
