class Admin::MemorySerializer < ApplicationSerializer
   attributes :id, :short_name, :slug, :order, :council, :quantity, :base_year,
              :beings, :wikies, :paterics, :descriptions, :memory_names, :events

   def slug
      SlugSerializer.new(object.slug) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions,
                                                        locales: locales) ;end

   def wikies
      ActiveModel::Serializer::CollectionSerializer.new(object.wikies,
                                                        locales: locales) ;end

   def beings
      ActiveModel::Serializer::CollectionSerializer.new(object.beings,
                                                        locales: locales) ;end

   def events
      ActiveModel::Serializer::CollectionSerializer.new(object.events,
                                                        locales: locales,
                                                        serializer: Admin::EventSerializer) ;end

   def memory_names
      ActiveModel::Serializer::CollectionSerializer.new(object.memory_names,
                                                        locales: locales,
                                                        serializer: Admin::MemoryNameSerializer) ;end

   def paterics
      ActiveModel::Serializer::CollectionSerializer.new(object.paterics,
                                                        locales: locales) ;end;end
