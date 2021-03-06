class AddPrimaryKeyToMemories < ActiveRecord::Migration[4.2]
   safety_assured

   def change
      safety_assured do
         change_column_null :memories, :short_name, false

         remove_index :memories, name: "index_memories_on_short_name"
         add_index :memories, %w(short_name), name: "index_memories_on_short_name",
            unique: true, using: :btree end;end;end
