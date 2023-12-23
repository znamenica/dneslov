#Допустим('Сбросим последовательность индексов для картинок') do
#   Picture.connection.execute("drop sequence pictures_id_seq CASCADE")
#   Picture.connection.execute("create sequence pictures_id_seq MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 OWNED BY pictures.id")
#   Picture.connection.execute('ALTER TABLE "pictures" ALTER COLUMN "id" SET DEFAULT nextval(\'pictures_id_seq\'::regclass)')
#end

Допустим('не єствує ни єдне картинке') do
   Picture.destroy_all
end

Пусть(/сѫ "([^"]+)" слика?/) do |number|
   FactoryBot.create_list(:picture, number.to_i)
end

Если('сдѣлаю {string} запытъ до адреса {string}') do |proto, address|
   @response = send(proto.downcase, address)
end

Если("сдѣлаю {string} запытъ до адреса {string} сꙛ доводом {string}") do |proto, address, parms|
   @response = send(proto.downcase, address, parms)
end

То('добѫдꙛ приблизнъ извод:') do |doc_string|
   answer = JSON.parse(@response.body)
   expect(answer.to_yaml.strip).to eq(doc_string)
end

Допустим('є картинка сѫ даными:') do |table|
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:picture, attrs)
end

То('добѫдꙛ кодъ поврата {string}') do |code|
   expect(@response.status).to eq(code.to_i)
end

Пусть('сѫ слике:') do |doc_string|
   hash = YAML.load(doc_string)
   hash.each { |attrs| FactoryBot.create(:picture, attrs) }
end

Если('запытаю створенје изнахоѕи {string} сꙛ даными:') do |path, table|
   attrs = FactoryBot.attributes_for(:picture, table.rows_hash.transform_values { |value| YAML.load(value) })
   @response = post(path, { picture: attrs })
end

Если('изнахоѕь картинци {string} бѫдє яко:') do |title, doc_string|
   picture = Picture.by_title(title).first
   expect(picture).to match_record_yaml(doc_string)
end

Если('запытаю одсланје картинке в изнаходь {string} сꙛ даными:') do |path, table|
   picture = Picture.by_title(title).first
   attrs = FactoryBot.attributes_for(:picture, table.rows_hash.transform_values { |value| YAML.load(value) })
   @response = put(path, { picture: attrs })
end

Если('запытаю добыванје из изнахоѕи {string}') do |path|
   @response = get(path)
end

То('добѫдꙛ вывод:') do |doc_string|
   answer = JSON.parse(@response.body)
   expect(answer.to_yaml.strip).to eq(doc_string)
end

Если('запытаю изтрѣнје изнахоѕи {string}') do |url|
   @response = delete(url)
end

То('картинка {string} не будє єствовати') do |title|
   picture = Picture.by_title(title).first
   expect(picture).to be_blank
end

Если('покушаю створити {string} запытъ до адреса {string}') do |proto, address|
   expect { @response = send(proto.downcase, address) }.to raise_error(Exception)
end

То('не добѫдꙛ кодъ поврата') do
   expect(@response).to_not respond_to(:status)
end
