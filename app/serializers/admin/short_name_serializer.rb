class Admin::ShortNameSerializer < ApplicationSerializer
   attributes :id, :name
   
   def name
      "#{object.text} (#{object._language})" ;end;end
