class FixIndecesInLinks < ActiveRecord::Migration[5.2]
   def change
      change_table :links do |t|
         t.index %i(type)
         t.index %i(language_code)
         t.index %i(alphabeth_code)
         t.index %i(url)
         t.index %i(info_id)
         t.index %i(info_type)
         t.index %i(info_type info_id) ;end;end;end
