class MakeTextInSlugsUnique < ActiveRecord::Migration[5.2]
   safety_assured

   def change
      safety_assured do
         remove_index(:slugs, column: ["text"], name: "index_slugs_on_text")
         add_index :slugs, ["text"], name: "index_slugs_on_text", unique: true
      end
   end
end
