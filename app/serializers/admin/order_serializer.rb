class Admin::OrderSerializer < ApplicationSerializer
   attributes :id, :slug, :tweets, :notes, :descriptions

   def slug
      SlugSerializer.new(object.slug) ;end

   def tweets
      ActiveModel::Serializer::CollectionSerializer.new(object.tweets,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def notes
      ActiveModel::Serializer::CollectionSerializer.new(object.notes,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.descriptions,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end;end
