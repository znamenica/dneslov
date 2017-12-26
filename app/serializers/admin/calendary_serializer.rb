class Admin::CalendarySerializer < CommonCalendarySerializer
   attributes :id, :slug, :language_code, :alphabeth_code, :author_name, :date, :council,
              :names, :descriptions, :wikies, :links

   def names
      ActiveModel::Serializer::CollectionSerializer.new(object.names) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions) ;end

   def wikies
      ActiveModel::Serializer::CollectionSerializer.new(object.wikies) ;end

   def links
      ActiveModel::Serializer::CollectionSerializer.new(object.links) ;end

   def slug
      SlugSerializer.new(object.slug) ;end;end
