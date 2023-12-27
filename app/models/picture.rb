# Picture class is keeping image resources info
require 'securerandom'

class Picture < ApplicationRecord
   attr_writer :language, :alphabeth, :description, :title

   include WithTitles
   include WithDescriptions

   mount_base64_uploader :image, ImageUploader

   has_many :attitudes, class_name: :ImageAttitude
   has_many :memories, as: :imageable, through: :attitudes, source: :imageable, source_type: :Memory
   has_many :events, as: :imageable, through: :attitudes, source: :imageable, source_type: :Event

   scope :by_language, ->(l) do
      joins(:titles, :descriptions).where(titles: { language_code: l}).and(where(descriptions: { language_code: l}))
   end

   scope :by_alphabeth, ->(a) do
      joins(:titles, :descriptions).where(titles: { alphabeth_code: a}).and(where(descriptions: { alphabeth_code: a}))
   end

   validates_presence_of :type, :uid, :image
   validates :image, file_size: { less_than: 128.megabytes }, size: { height: { min: 1000, max: 30000 },
                                                                      width: { min: 100, max: 30000 },
                                                                      ratio: { range: (0.1..5.0) }}

   before_validation :fill_in_title_description, :fill_in_uid, :fill_in_digest, :fill_in_dimensions

   def fill_in_dimensions
      self.height = image.height
      self.width = image.width
   end

   def fill_in_digest
      self.digest ||= Digest::SHA2.hexdigest(IO.read(image.file.file))
   end

   def fill_in_uid
      self.uid ||= SecureRandom.uuid
   end

   def fill_in_title_description
      if @title
         if title = titles.where(language_code: @language, alphabeth_code: @alphabeth).first
            title.update_attribute(:text, @title)
         else
            titles << Title.new(text: @title, language_code: @language, alphabeth_code: @alphabeth)
         end
      end

      if @description
         if desc = descriptions.where(language_code: @language, alphabeth_code: @alphabeth).first
            desc.update_attribute(:text, @description)
         else
            descriptions << Description.new(text: @description, language_code: @language, alphabeth_code: @alphabeth)
         end
      end
   end

   # serialized
   def thumb_url
      File.join *[image.asset_host.to_s, image.store_dir, "thumb_" + image.filename]
   end

   def url
      File.join *[image.asset_host.to_s, image.store_dir, image.filename]
   end

   def title
      @title ||= titles.where(language_code: language, alphabeth_code: alphabeth).first&.text
   end

   def description
      @description ||= descriptions.where(language_code: language, alphabeth_code: alphabeth).first&.text
   end

   def language
     @language ||= titles.first&.language_code || descriptions.first&.language_code
   end

   def alphabeth
      @alphabeth ||= titles.first&.alphabeth_code || descriptions.first&.language_code
   end
end
