# Thumb class is keeping a thumbnail for an object
# thumbable is reference to a class: event, memory, or calendary
# uid - uid of the thumbnair to address to
class Thumb < ApplicationRecord
   mount_base64_uploader :thumb, ThumbUploader

   belongs_to :thumbable, polymorphic: true
   belongs_to :event, -> { where(thumbs: { thumbable_type: "Event" }) }, foreign_key: 'thumbable_id'
   belongs_to :memory, -> { where(thumbs: { thumbable_type: "Memory" }) }, foreign_key: 'thumbable_id'

   validates_presence_of :uid, :thumb
   validates_uniqueness_of :digest, on: :create
   validates_uniqueness_of :uid, :url
   validates :thumb, presence: true, on: :create, file_size: { less_than: 1.megabytes },
      size: { height: { min: 300 }, ratio: { range: (1.0..1.0) }}

   scope :by_uid, ->(uid) { where(uid: uid) }
   scope :by_thumbable_name, ->(name) do
      if /(?<short_name>.*)#(?<event>.*)/ =~ name
         joins(:event).merge(Event.by_did_and_short_name(event, short_name))
      else
         joins(:memory).merge(Memory.by_short_name(name))
      end
   end

   before_validation :fill_in_uid
   before_validation :fill_in_digest, :fill_in_url, if: -> { thumb.file }

   delegate :width, :height, to: :thumb

   # callbacks
   def fill_in_digest
      self.digest ||= Digest::SHA2.hexdigest(IO.read(thumb.file.file))
   end

   def fill_in_uid
      self.uid ||= SecureRandom.uuid
   end

   def fill_in_url
      self.url = File.join *[thumb.asset_host.to_s, thumb.store_dir, thumb.filename]
   end

   # assignments
   def thumbable_name= value
      @thumbable_name = value

      self.thumbable_id, self.thumbable_type =
         if /(?<name>.*)#(?<event>.*)/ =~ @thumbable_name
            [Event.by_did_and_short_name(event, name).first&.id, "Event"]
         else
            [Memory.by_short_name(value).first&.id, "Memory"]
         end

      value
   end

   def thumbable_name
      @thumbable_name ||=
         if thumbable_type == 'Memory'
            thumbable.short_name
         elsif thumbable_type == 'Event'
            "#{thumbable.memory.short_name}##{thumbable.id}"
         end
   end

   def root_memory
      @root_memory ||=
         if thumbable_type == 'Memory'
            thumbable
         elsif thumbable_type == 'Event'
            thumbable.memory
         end
   end

   def event_did
      @event ||=
         if thumbable_type == 'Event'
            thumbable.id
         end
   end

   def memory_short_name
      root_memory.short_name
   end
end
