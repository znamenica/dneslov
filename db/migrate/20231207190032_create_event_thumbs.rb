class CreateEventThumbs < ActiveRecord::Migration[7.0]
   def change
      create_table :subject_thumbs do |t|
         t.references :event
         t.oid :thumb, null: false

         t.timestamps
      end
   end
end
