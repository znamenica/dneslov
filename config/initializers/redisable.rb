unless Rails.env.production? or Rails.env.staging?
   Redisable.processor_kind = :inline
end
