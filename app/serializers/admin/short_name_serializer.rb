class Admin::ShortNameSerializer < ApplicationSerializer
   attributes :id, :name
   
   def name
      "#{object.text} (#{object.language&.names&.for(locales)&.text})" ;end;end
