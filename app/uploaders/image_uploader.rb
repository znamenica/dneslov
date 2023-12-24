class ImageUploader < CarrierWave::Uploader::Base
   include CarrierWave::RMagick

   process resize_to_fit: [100, 1000]
   process convert: 'webp'

   version :thumb do
      process resize_to_fill: [300,300]
   end

   def store_dir
      'public/images'
   end

   # If you upload 'file.jpg', you'll get 'image.webp' because of convert
   def filename
      "#{model.uid}.#{file.extension}"
   end

   def content_type_allowlist
      [/image\//]
   end
end
