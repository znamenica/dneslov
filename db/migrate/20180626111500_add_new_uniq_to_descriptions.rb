class AddNewUniqToDescriptions < ActiveRecord::Migration[4.2]
   def change
      Description.where(type: nil).update_all(type: 'Description')

      add_index :descriptions, ["describable_id", "describable_type", "alphabeth_code", "language_code", "type"],
                name: "describable_alphabeth_language_type_index",
                unique: true ;end;end
