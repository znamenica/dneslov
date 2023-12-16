# class keeping attitudes from a class to image
# imageable is reference to a class: event, memory
# picture is reference to an image
class ImageAttitude < ApplicationRecord
   belongs_to :imageable, polymorphic: true
   belongs_to :picture
end
