class CreateMentions < ActiveRecord::Migration[4.2]
   def change
      create_table :mentions do |t|
         t.belongs_to :calendary, null: false
         t.belongs_to :event, null: false
         t.string :year_date, null: false
         t.string :add_date

         t.timestamps null: false

         t.index %i(calendary_id event_id year_date), unique: true end;end;end
