class AddTextAndTextFormatToServices < ActiveRecord::Migration[5.2]
   def change
      change_table :services do |t|
         t.text :text
         t.string :text_format
      end
   end
end
