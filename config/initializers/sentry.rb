if Rails.env.production? or Rails.env.staging?
   Sentry.init do |config|
      config.dsn = ENV["SENTRY_DSN"]
      config.breadcrumbs_logger = [:sentry_logger, :active_support_logger, :http_logger]
      config.traces_sample_rate = 0.2
   end
end
