class AddNewUniqToDescriptions < ActiveRecord::Migration[5.2]
   safety_assured

   def change
      safety_assured do
         reversible do |dir|
            dir.up do
               ActiveRecord::Base.connection.execute("UPDATE descriptions SET type = 'Description' WHERE type IS NULL")
               ActiveRecord::Base.connection.execute("DELETE FROM descriptions WHERE id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (partition BY describable_id, describable_type, alphabeth_code, language_code, type ORDER BY id) AS rnum FROM descriptions) t WHERE t.rnum > 1)")
            end
         end

         add_index :descriptions, ["describable_id", "describable_type", "alphabeth_code", "language_code", "type"],
                   name: "describable_alphabeth_language_type_index",
                   unique: true
      end
   end
end
