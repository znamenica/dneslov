Rails.application.configure do
   config.middleware.insert_before 0, Rack::Cors do
      allow do
         origins "*"
         resource "*", headers: :any, methods: %i(get post put patch delete options)
      end
   end
end if Rails.env.production?
