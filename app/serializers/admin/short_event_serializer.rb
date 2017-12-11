class Admin::ShortEventSerializer < CommonCalendarySerializer
   attributes :id, :event
   
   def event
      [ object.type, object.type_number ].compact.join("#") ;end;end
