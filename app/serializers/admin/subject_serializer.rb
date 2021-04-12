class Admin::SubjectSerializer < ApplicationSerializer
   attributes :id, :key, :meta, :kind_code, :kind_name, :names, :descriptions

   def meta
      object.meta.to_json ;end

   def kind_name
      object._kind_title ;end

   def names
      object._descriptions.select { |d| d['type'] == 'Appellation' } ;end

   def descriptions
      object._descriptions.select { |d| d['type'] == 'Description' } ;end;end
