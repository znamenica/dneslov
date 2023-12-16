class CreateImageAttitudes < ActiveRecord::Migration[7.0]
   def change
      create_table :image_attitudes do |t|
         t.references :imageable, polymorphic: true, index: true
         t.references :picture, index: true

         t.timestamps
      end
   end
end
