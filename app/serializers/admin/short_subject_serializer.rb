class Admin::ShortSubjectSerializer < ApplicationSerializer
   attributes :key, :name

   def name
      object.name_for(@instance_options[:locales]) ;end;end
