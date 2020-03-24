class Admin::MemorySerializer < ApplicationSerializer
   attributes :id, :short_name, :slug, :order, :order_id, :council, :quantity, :base_year,
              :beings, :wikies, :paterics, :descriptions, :memory_names, :events, :notes

   def slug
      SlugSerializer.new(object.slug) ;end

   def order
     object.orders.first&.note_for(locales)&.text ;end

   def order_id
     object.orders.first&.note_for(locales)&.id ;end

   def notes
      ActiveModel::Serializer::CollectionSerializer.new(object.notes,
                                                        locales: locales) ;end

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
