class CreateCoverings < ActiveRecord::Migration[7.0]
   def change
      create_table :coverings do |t|
         t.references :place, foreign_key: { on_delete: :cascade }, comment: "Ссылка на место"
         t.references :memory, foreign_key: { on_delete: :cascade }, comment: "Ссылка на память"
         t.timestamp :add_date

         t.timestamps

         t.index %i(memory_id place_id), unique: true
      end

      remove_column :memories, :covers_to_id, type: :integer
   end
end
