class ChangeIndexOnDescriptions < ActiveRecord::Migration[5.2]
   def change
      enable_extension "btree_gin"

      change_table "descriptions" do |t|
         t.remove_index columns: ["describable_id", "describable_type", "alphabeth_code", "text"], name: "describable_alphabeth_index"

         t.index ["describable_id", "describable_type", "alphabeth_code", "text"], name: "describable_alphabeth_index", using: :gin
      end
   end
end
