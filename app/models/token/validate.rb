class Token::Validate < Token
   def default_expires_at
      Time.zone.now + 1.day
   end
end
