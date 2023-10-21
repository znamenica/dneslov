class FixUniqueIndexInNomina < ActiveRecord::Migration[7.0]
   def change
      reversible do |dir|
         dir.up do
            [
               "DROP INDEX index_memory_names_on_memory_id_and_nomen_id"
            ].each { |q| ActiveRecord::Base.connection.execute(q) }
         end
      end
   end
end
