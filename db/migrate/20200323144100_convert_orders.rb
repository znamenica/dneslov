class ConvertOrders < ActiveRecord::Migration[5.2]
   def change
      create_table :memo_orders do |t|
         t.references :order
         t.references :memo
         t.index %i(order_id memo_id), unique: true
      end

      reversible do |dir|
         dir.up do
            [
            "INSERT INTO slugs
                        (text, sluggable_type, sluggable_id)
                  SELECT concat(orders.order, '0'), 'Order', orders.id
                    FROM orders",
            "INSERT INTO descriptions
                        (describable_id, describable_type, type, text, alphabeth_code, language_code, created_at, updated_at)
                  SELECT id, 'Order', 'Description', orders.note, orders.alphabeth_code, orders.language_code, now(), now()
                    FROM orders",
            "INSERT INTO descriptions
                        (describable_id, describable_type, type, text, alphabeth_code, language_code, created_at, updated_at)
                  SELECT id, 'Order', 'Note', orders.short_note, orders.alphabeth_code, orders.language_code, now(), now()
                    FROM orders",
            "INSERT INTO descriptions
                        (describable_id, describable_type, type, text, alphabeth_code, language_code, created_at, updated_at)
                  SELECT id, 'Order', 'Tweet', orders.text, orders.alphabeth_code, orders.language_code, now(), now()
                    FROM orders",
            "INSERT INTO memo_orders
                        (order_id, memo_id)
                  SELECT orders.id, memoes.id
                    FROM orders, memoes, events, memories
                   WHERE orders.order = memories.order
                     AND memories.id = events.memory_id
                     AND events.id = memoes.event_id"
            ].each { |q| Order.connection.execute(q) }
         end

         dir.down do
            add_foreign_key :rpms, :srpms, on_delete: :cascade

            Order.connection.execute <<-SQL
                  DELETE FROM rpms
                        USING packages
                        WHERE packages.id = rpms.package_id
                          AND packages.type = 'Package::Built'
            SQL
         end
      end

      remove_column :orders, :order, :string
      remove_column :orders, :text, :string
      remove_column :orders, :alphabeth_code, :string
      remove_column :orders, :language_code, :string
      remove_column :orders, :short_note, :string
      remove_column :orders, :note, :string
   end
end
