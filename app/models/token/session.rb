class Token::Session < Token
   def default_expires_at
      Time.zone.now + 1.hour
   end
end
