class CreateMarkups < ActiveRecord::Migration[5.2]
   def change
      create_table :markups do |t|
         t.references :scriptum, index: true, null: false, foreign_key: { on_delete: :restrict }
         t.references :reading, index: true, null: false, foreign_key: { on_delete: :cascade }
         t.integer :begin, null: false
         t.integer :end, null: false
         t.integer :position, index: true

         t.index %i(scriptum_id reading_id)
         t.index %i(scriptum_id reading_id begin end), unique: true
      end
   end
end
