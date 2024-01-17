Допустим('є ужил сꙛ токнами и даными:') do |table|
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:user, :with_tokina, attrs)
end

Допустим('є ужил сꙛ даными:') do |table|
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:user, attrs)
end

Допустим('є учетка для ужила {string} сꙛ даными:') do |croi, table|
   user = User.by_credentials_or_id(croi).first
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:account, user: user, **attrs)
end

Пусть('сѫ {string} ужилов') do |number|
   FactoryBot.create_list(:user, number.to_i)
end

Пусть('сѫ ужили:') do |doc_string|
   hash = YAML.load(doc_string)
   hash.each { |attrs| FactoryBot.create(:user, attrs) }
end

Пусть('не єствує ни єдна ужила') do
   User.destroy_all
end

Если('запытаю створенје изнахоѕи ужила {string} сꙛ даными:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[h, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   headers.each { |(name, value)| header(name, value) }
   attrs = FactoryBot.attributes_for(:picture, **pre.to_h)

   @response = post(path, { user: attrs })
end

То('изнахоѕь ужила {string} бѫдє яко:') do |croi, doc_string|
   user = User.by_credentials_or_id(croi).first
   expect(user).to match_record_yaml(doc_string)
end

То('изнахоѕи ужила {string} не бѫдє') do |croi|
   user = User.by_credentials_or_id(croi).first
   expect(user).to be_blank
end

Если('запытаю одсланје ужила в изнаходь {string} сꙛ даными:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[h, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   headers.each { |(name, value)| header(name, value) }
   attrs = FactoryBot.attributes_for(:picture, **pre.to_h)

   @response = put(path, { user: attrs })
end

То('ужил {string} не будє єствовати') do |croi|
   user = User.by_credentials_or_id(croi).first
   expect(user).to be_blank
end
