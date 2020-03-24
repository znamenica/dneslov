class Admin::ShortOrderSerializer < CommonCalendarySerializer
   attributes :id, :order

   def order
      object.note_for( locales ).text ;end;end
