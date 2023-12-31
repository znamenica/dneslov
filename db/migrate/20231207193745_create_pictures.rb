class CreatePictures < ActiveRecord::Migration[7.0]
   def change
      create_table :pictures do |t|
         t.uuid :uid, index: { unique: true }, null: false
         t.binary :digest, index: { unique: true }, null: false
         t.string :url, index: { unique: true }, null: false
         t.string :thumb_url, index: { unique: true }, null: false
         t.string :type, null: false
         t.string :image, null: false
         t.integer :width, null: false, limit: 2
         t.integer :height, null: false, limit: 2
         t.jsonb :meta, index: { using: :gin }, default: {}

         t.timestamps
      end
   end
end
