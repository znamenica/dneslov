class ReindexTextOnDescriptions < ActiveRecord::Migration[4.2]
   safety_assured

   def change
      safety_assured do
         enable_extension "btree_gin"

         change_table "descriptions" do |t|
            t.remove_index columns: ["describable_id", "describable_type", "alphabeth_code", "text"], name: "describable_alphabeth_index", using: :gin

            t.index ["describable_id", "describable_type", "alphabeth_code"], name: "describable_id_type_alphabeth_code_index"

            t.text :text_new
         end

         Description.update_all("text_new = text")

         remove_column :descriptions, :text, :string

         change_table "descriptions" do |t|
            t.rename :text_new, :text

            t.index ["text"], name: "descriptions_text_index", using: :gin end;end;end;end
