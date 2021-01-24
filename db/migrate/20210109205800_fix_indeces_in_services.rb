class FixIndecesInServices < ActiveRecord::Migration[5.2]
   def change
      change_table :services do |t|
         t.index %i(language_code)
         t.index %i(alphabeth_code)
         t.index %i(text_format)
         t.index %i(gospel)
         t.index %i(apostle)
         t.index %i(author)
         t.index %i(source)
         t.index %i(description)
         t.index %i(ref_title)
         t.index %i(tone)
         t.index %i(name)
         t.index %i(info_id)
         t.index %i(info_type)
         t.index %i(type)
         t.index %i(info_type info_id) ;end;end;end
