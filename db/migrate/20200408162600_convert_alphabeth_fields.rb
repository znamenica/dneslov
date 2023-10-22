class ConvertAlphabethFields < ActiveRecord::Migration[5.2]
   def up
      %w(calendaries cantoes descriptions event_kinds links names services).each do |table_name|
         sql = "UPDATE #{table_name}
                SET alphabeth_code = UPPER(alphabeth_code)
                FROM memories"

         ActiveRecord::Base.connection.execute(sql)
      end
   end

   def down
      %w(calendaries cantoes descriptions event_kinds links names services).each do |table_name|
         sql = "UPDATE #{table_name}
                SET alphabeth_code = LOWER(alphabeth_code)
                FROM memories"

         ActiveRecord::Base.connection.execute(sql)
      end
   end
end
