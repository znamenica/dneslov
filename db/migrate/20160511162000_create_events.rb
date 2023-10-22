class CreateEvents < ActiveRecord::Migration[5.2]
   def change
      create_table :events do |t|
         t.string :happened_at
         t.string :subject # or belongs_to
         t.belongs_to :memory, null: false

         t.string :type, null: false
         t.timestamps null: false

         t.index %i(subject type memory_id)
      end
   end
end
