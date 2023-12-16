class CreateThumbs < ActiveRecord::Migration[7.0]
   def change
      create_table :thumbs do |t|
         t.uuid :uid, index: { unique: true }, null: false
         t.oid :thumb, null: false
         t.references :thumbable, polymorphic: true, index: true, null: false

         t.timestamps
      end
   end
end
