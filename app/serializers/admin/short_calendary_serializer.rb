class Admin::ShortCalendarySerializer < CommonCalendarySerializer
   attributes :id, :calendary
   
   def calendary
      object.name_for(@instance_options[:locales]).text ;end;end
