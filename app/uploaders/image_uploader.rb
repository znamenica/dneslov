class ImageUploader < CarrierWave::Uploader::Base
   include CarrierWave::RMagick

   storage :file

   process convert: 'webp'

   version :thumb do
      process resize_to_fit: [300,300]
   end

   def store_dir
      'images'
   end

   # If you upload 'file.jpg', you'll get 'image.webp' because of convert
   def filename
      "#{model.uid}.#{file.extension}"
   end

   def content_type_allowlist
      [/image\//]
   end

   def asset_host
      case h = Rails.application.config.asset_host
      when Proc
         h[]
      when String, Symbol
         h
      else
         nil
      end
   end
end
