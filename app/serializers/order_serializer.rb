class OrderSerializer < ApplicationSerializer
   attributes :title, :slug, :color

   def title
      object.title ;end

   def slug
      object.slug ;end

   def color
      color_by_slug( slug ) ;end;end
