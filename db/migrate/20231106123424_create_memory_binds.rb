class CreateMemoryBinds < ActiveRecord::Migration[7.0]
   def change
      create_table :memory_binds do |t|
         t.references :memory, foreign_key: { on_delete: :cascade }, comment: "Собственно память"
         t.references :bond_to, foreign_key: { to_table: :memories, on_delete: :cascade }, comment: "Память как целевая связка"
         t.string :kind, comment: "Вид связки: источник (Source) для списков икон, " +
            "опора (Base) - иконы личностей, подобие (Similar) - для установления подобия"

         t.timestamps

         t.index %i(memory_id bond_to_id), unique: true
      end

      remove_column :memories, :bond_to_id, type: :integer
   end
end
