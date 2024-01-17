class CreateTokina < ActiveRecord::Migration[7.0]
   def change
      create_table :tokina do |t|
         t.string :code, null: false, index: { unique: true }, length: 36
         t.string :type, null: false, index: true, length: 15
         t.references :tokenable, polymorphic: true, index: true, null: false
         t.datetime :expires_at, index: true
      end
   end
end
