class CreateOrders < ActiveRecord::Migration[5.2]
   def change
      create_table :orders do |t|
         t.string :order, index: true
         t.string :text, index: true
         t.string :alphabeth_code
         t.string :language_code

         t.index %i(order alphabeth_code), unique: true
         t.index %i(text alphabeth_code language_code)
      end
   end
end
