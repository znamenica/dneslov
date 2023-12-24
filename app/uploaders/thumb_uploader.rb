class ThumbUploader < CarrierWave::Uploader::Base
   include CarrierWave::RMagick

   storage :file

   process resize_to_fit: [300, 300]
   process convert: 'webp'

   def store_dir
      'public/thumbs'
   end

   def filename
      "#{model.uid}.#{file.extension}"
   end

   def content_type_allowlist
      [/image\//]
   end
end
