# class keeping attitudes from a class to image
# imageable is reference to a class: event, memory
# picture is reference to an image
class ImageAttitude < ApplicationRecord
   belongs_to :imageable, polymorphic: true
   belongs_to :picture

   validates_presence_of :imageable, :picture

   def imageable_name= value
      @imageable_name = value

      self.imageable_id, self.imageable_type =
         if /(?<name>.*)#(?<event>.*)/ =~ @imageable_name
            [Event.by_did_and_short_name(event, name).first&.id, "Event"]
         else
            [Memory.by_short_name(value).first&.id, "Memory"]
         end

      value
   end

   def imageable_name
      @imageable_name ||=
         if imageable_type == 'Memory'
            imageable.short_name
         elsif imageable_type == 'Event'
            "#{imageable.memory.short_name}##{imageable.id}"
         end
   end

   # format pos field is <(1,1),5>
   def pos_at= value
      /(?<x>[0-9]+),(?<y>[0-9]+)/ =~ value

      self.pos = "<(#{x},#{y}),30>" if x and y
   end
end
