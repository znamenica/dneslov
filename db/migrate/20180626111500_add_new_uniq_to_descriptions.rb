class AddNewUniqToDescriptions < ActiveRecord::Migration[4.2]
   safety_assured

   def change
      safety_assured do
         Description.where(type: nil).update_all(type: 'Description')

         ActiveRecord::Base.connection.execute("DELETE FROM descriptions WHERE id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (partition BY describable_id, describable_type, alphabeth_code, language_code, type ORDER BY id) AS rnum FROM descriptions) t WHERE t.rnum > 1)")

         add_index :descriptions, ["describable_id", "describable_type", "alphabeth_code", "language_code", "type"],
                   name: "describable_alphabeth_language_type_index",
                   unique: true end;end;end
