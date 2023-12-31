class ImageUploader < CarrierWave::Uploader::Base
   include CarrierWave::RMagick

   storage :file

   process convert: 'webp'
   process :auto_orient
   process upfit: [100,1000], if: :match_size?

   version :thumb do
      process resize_to_fit: [400,400]
   end

   def match_size? file
      height >= 600 if file
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

   def auto_orient
      manipulate! do |img|
         img.auto_orient!
         img
      end
   end

   def upfit *to
      s = [to, [width, height]].transpose.map {|x| x.max }
      ro = width.to_f / height
      r = s[0].to_f / s[1]
      sizes = (ro < r ? [s[0], s[1] * r / ro] : [s[0] * ro / r, s[1]])

      manipulate! do |img|
         img.resize!(*sizes, Magick::LagrangeFilter) unless ro == r

         img
      end
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
