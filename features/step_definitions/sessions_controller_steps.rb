Допустим('є ужил сѫ даными:') do |table|
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:user, attrs)
end

Допустим('є учетка для ужила {string} сѫ даными:') do |crdi, table|
   user = User.by_credentials_or_id(crdi).first
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:account, attrs.merge(user: user))
end

Если('мрозим час на {string}') do |time|
   Timecop.freeze(time)
end

Если('запытаю одсланје данех и заглавка наряде в {string}:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[k, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   #TODO
   attrs = FactoryBot.attributes_for(:picture, pre.to_h)
   headers.each { |(name, value)| header(name, value) }
   #binding.pry
   @response = post(path, attrs)
end

То('добѫдꙛ заглавкы {string}') do |list|
   list.split(/\s+,\s+/).each do |name|
      expect(@response.headers[name]).to_not be_nil
   end
end

То('добѫдꙛ пустъ выводъ') do
   expect(@response.body).to be_blank
end

То('не добѫдꙛ заглавкы {string}') do |string|
   list.split(/\s+,\s+/).each do |name|
      expect(@response.headers[name]).to be_nil
   end
end

Если('єствує ужил сꙛ завѣрным токном {string}') do |validate_token|
   @current = FactoryBot.create(:user, validate_token: validate_token)
end

Если('поновям дане наряде в {string} сꙛ завѣрным токном для ужила {string}') do |path, croi|
   token = User.by_credentials_or_id(croi).first.tokina.where(type: "Token::Validate").first
   header("Authorization", "Validate #{token.code}")
   @response = put(path)
end

То('завѣрям одсланје писма для ужила {string} сꙛ завѣрным токном') do |croi|
   user = User.by_credentials_or_id(croi).first
   expect(ActionMailer::Base.deliveries).to include(Mail::Message)
   expect(ActionMailer::Base.deliveries.first.to.first).to eql(user.email.no)
end

То('одсланја писма для ужила {string} сꙛ завѣрным токном не бѫдє') do |croi|
   user = User.by_credentials_or_id(croi).first
   ActionMailer::Base.deliveries.each do |dela|
      expect(dela&.to&.first).to_not eql(user.email.no)
   end
end

Если('поновям дане и заглавкъ наряде в {string}:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[h, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   attrs = FactoryBot.attributes_for(:picture, pre.to_h)
   headers.each { |(name, value)| header(name, value) }

   @response = put(path, attrs)
end

Если('єствує ужил сꙛ поновячым токном {string}') do |refresh_token|
   @current = FactoryBot.create(:user, refresh_token: refresh_token)
end

То('сꙛчасна наряда не будє єствовати') do
   expect(Token::Session.all).to be_blank
end

Если('єствує ужил сꙛ нарядным токном {string}') do |session_token|
   @current = FactoryBot.create(:user, session_token: session_token)
end

Если('єствує ужил сꙛ поновячым токном {string} и нарядным токном {string}') do |refresh_token, session_token|
   @current = FactoryBot.create(:user, refresh_token: refresh_token, session_token: session_token)
end
