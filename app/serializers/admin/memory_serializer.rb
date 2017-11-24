class Admin::MemorySerializer < ApplicationSerializer
   attributes :short_name, :slug, :order, :council, :quantity, :view_string,
              :beings, :wikies, :paterics, :descriptions, :memory_names, :events

   def slug
      SlugSerializer.new(object.slug) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions) ;end

   def wikies
      ActiveModel::Serializer::CollectionSerializer.new(object.wikies) ;end

   def beings
      ActiveModel::Serializer::CollectionSerializer.new(object.beings) ;end

   def events
      ActiveModel::Serializer::CollectionSerializer.new(object.events) ;end

   def memory_names
      ActiveModel::Serializer::CollectionSerializer.new(object.memory_names) ;end

   def paterics
      ActiveModel::Serializer::CollectionSerializer.new(object.paterics) ;end;end
