class CreateEventKinds < ActiveRecord::Migration[5.2]
   def change
      create_table :event_kinds do |t|
         t.string :kind, index: true
         t.string :text, index: true
         t.string :alphabeth_code
         t.string :language_code

         t.index %i(kind alphabeth_code), unique: true
         t.index %i(text alphabeth_code language_code)
      end
   end
end
