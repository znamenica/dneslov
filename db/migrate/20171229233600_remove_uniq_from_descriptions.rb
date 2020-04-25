class RemoveUniqFromDescriptions < ActiveRecord::Migration[4.2]
   safety_assured

   def change
      safety_assured do
         remove_index :descriptions, name: :describable_alphabeth_index
         add_index :descriptions, ["describable_id", "describable_type", "alphabeth_code", "text"], name: "describable_alphabeth_index" end;end;end
