class Admin::SubjectSerializer < ApplicationSerializer
   attributes :id, :key, :meta, :kind_code, :kind_name, :names, :descriptions

   def meta
      object.meta.to_json
   end

   def kind_name
      object.kind.names.for( locales )&.text
   end

   def names
      ActiveModel::Serializer::CollectionSerializer.new(object.names,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end;end
