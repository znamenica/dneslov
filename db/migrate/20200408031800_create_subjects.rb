class CreateSubjects < ActiveRecord::Migration[5.2]
   def change
      create_table :subjects do |t|
         t.string :kind, null: false, index: true
         t.string :key, null: false, index: { unique: true }
         t.json :meta

         t.timestamps null: false
      end
   end
end
