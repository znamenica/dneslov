class Admin::MemorySerializer < ApplicationSerializer
   attributes :id, :short_name, :slug, :order, :council, :quantity, :view_string, :base_year,
              :beings, :wikies, :paterics, :descriptions, :memory_names, :events

   def slug
      SlugSerializer.new(object.slug) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions, locales: @instance_options[:locales]) ;end

   def wikies
      ActiveModel::Serializer::CollectionSerializer.new(object.wikies, locales: @instance_options[:locales]) ;end

   def beings
      ActiveModel::Serializer::CollectionSerializer.new(object.beings, locales: @instance_options[:locales]) ;end

   def events
      ActiveModel::Serializer::CollectionSerializer.new(object.events, locales: @instance_options[:locales]) ;end

   def memory_names
      ActiveModel::Serializer::CollectionSerializer.new(object.memory_names, locales: @instance_options[:locales]) ;end

   def paterics
      ActiveModel::Serializer::CollectionSerializer.new(object.paterics, locales: @instance_options[:locales]) ;end;end
