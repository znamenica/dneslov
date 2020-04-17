class Admin::ShortSubjectSerializer < ApplicationSerializer
   attributes :key, :name

   def name
      object.names.for( locales )&.text ;end;end
