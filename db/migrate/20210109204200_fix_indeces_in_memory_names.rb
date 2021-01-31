class FixIndecesInMemoryNames < ActiveRecord::Migration[5.2]
   def change
      reversible do |dir|
         dir.up do
            # dedup
            q = "DELETE
                   FROM memory_names a
                  USING memory_names b
                  WHERE a.id > b.id
                    AND a.memory_id = b.memory_id
                    AND a.name_id = b.name_id"

            MemoryName.connection.execute(q)
         end
      end

      change_table :memory_names do |t|
         t.index %i(memory_id)
         t.index %i(name_id)
         t.index %i(memory_id id)
         t.index %i(memory_id name_id), unique: true ;end;end;end
