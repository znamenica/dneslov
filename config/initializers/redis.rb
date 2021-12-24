Rails.application.configure do
   config.cache_store = :redis_store, {
      host: "localhost",
      port: 6379,
      db: 0,
      namespace: "cache"
   }, {
      expires_in: 1.day,
      key: "_#{Rails.application.class.parent_name.downcase}_cache",
   }

   config.session_store :redis_store,
      servers: ["redis://localhost:6379/1/session"],
      expire_after: 1.day,
      key: "_#{Rails.application.class.parent_name.downcase}_session",
      threadsafe: true,
      secure: true

   if Rails.env.production?
      config.action_dispatch.rack_cache = {
         expire_after: 1.day,
         metastore: "redis://localhost:6379/2/metastore",
         entitystore: "redis://localhost:6379/2/entitystore",
         compress: Snappy
      }
   end
end
