class CreateUsers < ActiveRecord::Migration[4.2]
   def change
      create_table :users do |t|
         t.string :email
         t.string :first_name
         t.string :nick_name
         t.string :last_name ;end;end;end
