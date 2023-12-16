# class keeping image resources info
class Picture < ApplicationRecord
   include WithTitles
   include WithDescriptions

   mount_uploader :image, ImageUploader

   has_many :attitudes, class_name: :ImageAttitude
   has_many :memories, as: :imageable, through: :attitudes, source: :imageable, source_type: :Memory
   has_many :events, as: :imageable, through: :attitudes, source: :imageable, source_type: :Event

   validates_presence_of :type, :uid, :image
end
