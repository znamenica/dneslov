class ReindexTextOnDescriptionsToMd5 < ActiveRecord::Migration[4.2]
   def change
      change_table "descriptions" do |t|
         t.remove_index column: ["text"], name: "descriptions_text_index", using: :gin

         t.index 'md5(text)', name: "descriptions_text_index"
      end
   end
end
