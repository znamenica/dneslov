class CreateServiceMagnifications < ActiveRecord::Migration[5.2]
   def change
      create_table :service_magnifications do |t|
         t.belongs_to  :service, null: false
         t.belongs_to  :magnification, null: false

         t.index %i(service_id magnification_id), unique: true
      end
   end
end
