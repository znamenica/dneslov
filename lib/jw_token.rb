module JwToken
  def self.encode(sub)
    payload = {
      iss: ENV['FLASHCARDS_CLIENT_URL'],
      sub: sub,
      exp: 4.hours.from_now.to_i,
      iat: Time.now.to_i
    }
    JWT.encode payload, ENV['JWT_SECRET'], 'HS256'
  end

  def self.decode(token)
    options = {
      iss: ENV['FLASHCARDS_CLIENT_URL'],
      verify_iss: true,
      verify_iat: true,
      leeway: 30,
      algorithm: 'HS256'
    }
    JWT.decode token, ENV['JWT_SECRET'], true, options
  end
end
