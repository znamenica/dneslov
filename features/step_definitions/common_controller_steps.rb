Если('сдѣлаю {string} запытъ до адреса {string}') do |proto, address|
   @response = send(proto.downcase, address)
end

Если("сдѣлаю {string} запытъ до адреса {string} сꙛ доводом {string}") do |proto, address, parms|
   @response = send(proto.downcase, address, parms)
end

Если('сдѣлаю {string} запытъ до адреса {string} сꙛ заглавјем:') do |proto, address, doc_string|
   YAML.load(doc_string).each { |title, value| header(title, value) }
   @response = send(proto.downcase, address)
end

То('добѫдꙛ кодъ поврата {string}') do |code|
   expect(@response.status).to eq(code.to_i)
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

Если('покушаю створити {string} запытъ до адреса {string}') do |proto, address|
   expect { @response = send(proto.downcase, address) }.to raise_error(Exception)
end

То('не добѫдꙛ кодъ поврата') do
   expect(@response).to_not respond_to(:status)
end

То('добѫдꙛ охватъ {string}') do |range|
   expect(@response.headers["Content-Range"]).to eql("records #{range}")
end

То('добѫдꙛ длину охвата {string}') do |size|
   expect(@response.headers["Content-Length"]).to eql(size.to_i)
end

То('вывода не бѫдє') do
   expect(@response).to be_nil
end
