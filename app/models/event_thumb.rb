class EventThumb < ApplicationRecord
   mount_uploader :avatar, ThumbUploader

   belong_to :event
end
