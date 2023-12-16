# Thumb class is keeping a thumbnail for an object
# thumbable is reference to a class: event, memory, or calendary
# uid - uid of the thumbnair to address to
class Thumb < ApplicationRecord
   mount_base64_uploader :thumb, ThumbUploader, file_name: -> (th) { th.uid }

   belongs_to :thumbable, polymorphic: true

   validates_presence_of :uid, :thumb

   scope :by_uid, ->(uid) { where(uid: uid) }
end
