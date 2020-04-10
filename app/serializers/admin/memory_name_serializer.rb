class Admin::MemoryNameSerializer < ApplicationSerializer
   attributes :id, :feasible, :name_id, :name, :state, :state_name, :mode

   def state_name
      Subject.where( key: object.state ).first&.name_for( locales ) ;end

   def name
      object.name.text ;end;end
