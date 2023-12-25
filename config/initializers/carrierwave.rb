CarrierWave.configure do |config|
   config.permissions = 0666
   config.directory_permissions = 0777
   config.storage = :file

   if Rails.env.development?
      config.ignore_integrity_errors = false
      config.ignore_processing_errors = false
      config.ignore_download_errors = false
   elsif Rails.env.test?
      config.enable_processing = false
   end
end
