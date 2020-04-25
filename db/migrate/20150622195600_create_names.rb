class CreateNames < ActiveRecord::Migration[4.2]
   def change
      create_table :names do |t|
         t.string :text, null: false
         t.string :type, null: false, default: ''
         t.integer :language_code, null: false
         t.timestamps null: false

         t.index %i(text type language_code), unique: true end;end;end
