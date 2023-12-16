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
   elsif Rails.env.production?
      config.asset_host = proc do |file|
        identifier = "dneslov"
        "http://#{identifier}.cdn.vk.com"
      end
   end
end
