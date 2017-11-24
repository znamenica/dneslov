class Admin::ShortPlaceSerializer < CommonCalendarySerializer
   attributes :id, :name
   
   def name
      object.description_for(@instance_options[:locales]).text ;end;end
