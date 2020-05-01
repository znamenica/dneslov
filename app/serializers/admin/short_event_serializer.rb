class Admin::ShortEventSerializer < CommonCalendarySerializer
   attributes :id, :event
   
   def event
     [ object.kind&.names&.for( locales )&.text, object.type_number ].compact.join("#") ;end;end
