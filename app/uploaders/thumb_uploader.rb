class ThumbUploader < CarrierWave::Uploader::Base
   storage :postgresql_lo
end
