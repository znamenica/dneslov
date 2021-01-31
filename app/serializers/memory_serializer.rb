class MemorySerializer < ApplicationSerializer
   attributes :names, :links, :events, :cantoes, :short_name, :slug

   def slug
      object._slug ;end

   def names
      object._names ;end

   def links
      object._links ;end

   def events
      query = object.events
                    .memoed
                    .with_cantoes(locales)
                    .with_memoes(locales)
                    .with_place(locales)
                    .with_titles(locales)
                    .with_description(locales)

      ActiveModel::Serializer::CollectionSerializer.new( query,
                                                         locales: locales,
                                                         date: date,
                                                         julian: julian,
                                                         calendary_slugs: calendary_slugs ) ;end

   def cantoes
      object._cantoes ;end;end
