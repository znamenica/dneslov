class CreateAccounts < ActiveRecord::Migration[7.0]
   def change
      create_table :accounts do |t|
         t.string :no, null: false
         t.string :type, null: false
         t.references :user, foreign_key: { on_delete: :cascade }, null: false

         t.index %i(no type), unique: true
      end
   end
end
