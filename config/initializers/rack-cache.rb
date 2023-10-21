Rails.application.configure do
   if Rails.env.production? or Rails.env.staging?
      Rack::Cache::Key.query_string_ignore = proc { |k, v| k =~ /^(dashboard|short_|auth|icons|orders|memories|calendaries|memoes|names|subjects|scripta|readings)/ }

      config.action_dispatch.rack_cache = {
         expire_after: 1.day,
         metastore: "redis://localhost:6379/2/metastore",
         entitystore: "redis://localhost:6379/2/entitystore",
         compress: Snappy
      }
   end
end
