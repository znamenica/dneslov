Rails.application.configure do
   config.cache_store = :redis_store, {
      host: "localhost",
      port: 6379,
      db: 0,
   }, {
      expires_in: 1.day,
      key: "_#{Rails.application.class.name.split("::").first.downcase}_cache",
   }

   config.session_store :redis_store,
      servers: ["redis://localhost:6379/1/session"],
      expire_after: 1.day,
      key: "_#{Rails.application.class.name.split("::").first.downcase}_session",
      threadsafe: true,
      secure: true
end
