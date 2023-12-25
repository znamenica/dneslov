class CreateImageAttitudes < ActiveRecord::Migration[7.0]
   def change
      create_table :image_attitudes do |t|
         t.references :picture, index: true, null: false
         t.references :imageable, polymorphic: true, index: true

         t.jsonb :meta, index: { using: :gin }, default: {}
         t.circle :pos

         t.timestamps
      end
   end
end
