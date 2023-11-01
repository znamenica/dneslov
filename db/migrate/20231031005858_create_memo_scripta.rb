class CreateMemoScripta < ActiveRecord::Migration[7.0]
   def change
      create_table :memo_scripta do |t|
         t.references :memo
         t.references :scriptum
         t.string :kind, index: true, comment: "Тип свѧзке от, к, или авторство"

         t.timestamps

         t.index %i(memo_id scriptum_id kind), unique: true
      end
   end
end
