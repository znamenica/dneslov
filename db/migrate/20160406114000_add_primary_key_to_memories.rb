class AddPrimaryKeyToMemories < ActiveRecord::Migration[5.2]
   safety_assured

   def change
      change_column_null :memories, :short_name, false

      remove_index :memories, %w(short_name)
      add_index :memories, :short_name, name: "index_memories_on_short_name",
         unique: true, using: :btree
   end
end
