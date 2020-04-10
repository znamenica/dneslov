class Admin::SubjectSerializer < ApplicationSerializer
   attributes :id, :key, :meta, :kind, :kind_name, :names, :descriptions

   def meta
     object.meta.to_json
   end

   def kind_name
      Subject.find_by( key: object.kind )&.name_for( locales )
   end

   def names
      ActiveModel::Serializer::CollectionSerializer.new(object.names,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end;end
