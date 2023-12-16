class CreatePictures < ActiveRecord::Migration[7.0]
   def change
      create_table :pictures do |t|
         t.uuid :uid, index: { unique: true }, null: false
         t.string :type, null: false
         t.string :image, null: false
         t.jsonb :meta, index: { using: :gin }, default: {}

         t.timestamps
      end
   end
end
