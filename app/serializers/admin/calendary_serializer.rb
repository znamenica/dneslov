class Admin::CalendarySerializer < CommonCalendarySerializer
   attributes :id, :slug, :language_code, :language, :alphabeth_code, :alphabeth, :author_name, :date, :council, :licit,
              :names, :descriptions, :wikies, :links

   def date
     object.date; end

   def language
      object.language_for( locales )&.text ;end

   def alphabeth
      object.alphabeth_for( locales )&.text ;end

   def names
      ActiveModel::Serializer::CollectionSerializer.new(object.names,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def wikies
      ActiveModel::Serializer::CollectionSerializer.new(object.wikies,
                                                        locales: locales,
                                                        serializer: Admin::LinkSerializer) ;end

   def links
      ActiveModel::Serializer::CollectionSerializer.new(object.links,
                                                        locales: locales,
                                                        serializer: Admin::LinkSerializer) ;end

   def slug
      SlugSerializer.new(object.slug) ;end;end
