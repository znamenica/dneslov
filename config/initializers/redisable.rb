unless Rails.env.production?
   Redisable.processor_kind = :inline
end
