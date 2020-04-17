class Admin::MemoryNameSerializer < ApplicationSerializer
   attributes :id, :feasible, :name_id, :name, :state_code, :state_name, :mode

   def state_name
      object.state&.names&.for( locales )&.text ;end

   def name
     "#{object.name.text} (#{object.name.language.names.for( locales )&.text})" ;end;end
