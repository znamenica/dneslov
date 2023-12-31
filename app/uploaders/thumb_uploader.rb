class ThumbUploader < CarrierWave::Uploader::Base
   include CarrierWave::RMagick

   storage :file

   process resize_to_fit: [300, 300], if: :match_size?
   process convert: 'webp'

   def store_dir
      "thumbs/#{model.uid[0..1]}"
   end

   def match_size? file
      height >= 300 if file
   end

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
