class Admin::ShortEventSerializer < CommonCalendarySerializer
   attributes :id, :event
   
   def event
     [ object.kind_name_subject&.names&.for( locales )&.text, object.type_number ].compact.join("#") ;end;end
