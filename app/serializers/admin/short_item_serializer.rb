class Admin::ShortItemSerializer < CommonCalendarySerializer
   attributes :id, :item

   def item
      object.description_for(@instance_options[:locales]).text ;end;end
