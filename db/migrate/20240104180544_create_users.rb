class CreateUsers < ActiveRecord::Migration[7.0]
   def change
      create_table :users do |t|
         t.jsonb :settings, defaults: {}
         t.string :encrypted_password, null: false
         t.string :salt
         t.datetime :last_login_at, index: true
         t.datetime :last_active_at, index: true

         t.timestamps
      end
   end
end
