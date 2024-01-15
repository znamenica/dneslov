class Token::Refresh < Token
   def default_expires_at
      Time.zone.now + 1.month
   end
end
