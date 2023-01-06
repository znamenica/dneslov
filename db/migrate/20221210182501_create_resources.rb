class CreateResources < ActiveRecord::Migration[7.0]
   PROPS =
      {
         type: 'text',
         event: 'text',
         short_name: 'text',
         comment: 'text',
         imageinfo: 'text',
         fileinfo: 'text',
         kind: 'text',
         width: 'int',
         height: 'int'
      }

   def change
      create_table :resources do |t|
         t.string :path, index: true
         t.jsonb :props

         t.timestamps
      end

      change_table :links do |t|
         t.references :resource, index: true, null: true, foreign_key: { on_delete: :cascade }
      end

      reversible do |dir|
         dir.up do
            qs = PROPS.map do |(name, type)|
               "CREATE INDEX #{name}_index_on_props_resources
                          ON resources (((props ->> '#{name}')::#{type}))
                       WHERE (props ->> '#{name}') IS NOT NULL"
            end.each { |q| ActiveRecord::Base.connection.execute(q) }
         end

         dir.down do
            qs = PROPS.map do |(name, _type)|
               "DROP INDEX IF EXISTS #{name}_index_on_props_resources"
            end.each { |q| ActiveRecord::Base.connection.execute(q) }
         end
      end
   end
end
