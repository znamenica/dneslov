class CreateMemoriesNames < ActiveRecord::Migration[4.2]
   def change
      create_table :memories_names do |t|
         t.belongs_to :memory, null: false
         t.belongs_to :name, null: false

         t.index %i(memory_id name_id), unique: true end;end;end
