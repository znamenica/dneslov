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
   #TODO
   def filename
      "image.#{file.extension}" # If you upload 'file.jpg', you'll get 'image.jpg'
   end

   def content_type_allowlist
      [/image\//]
   end

end
