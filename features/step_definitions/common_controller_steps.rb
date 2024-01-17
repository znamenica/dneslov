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

То('добѫдꙛ приблизнъ изводъ:') do |doc_string|
   expect(@response).to match_response_json_yaml(doc_string)
end

То('добѫдꙛ кодъ поврата {string}') do |code|
   expect(@response.status).to eq(code.to_i)
end

Если('запытаю добыванје из изнахоѕи {string}') do |path|
   @response = get(path)
end

Если('запытаю добыванје из изнахоѕи {string}:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[h, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   headers.each { |(name, value)| header(name, value) }

   @response = get(path)
end

То('добѫдꙛ выводъ:') do |doc_string|
   answer = JSON.parse(@response.body)
   expect(answer.to_yaml.strip).to eq(doc_string)
end

Если('запытаю изтрѣнје изнахоѕи {string}') do |url|
   @response = delete(url)
end

Если('запытаю изтрѣнје изнахоѕи {string}:') do |path, table|
   pre, headers = table.rows_hash.transform_values { |value| YAML.load(value) }.reduce([[], []]) do |r, (k, v)|
      if /(?<h>[^:]*):/ =~ k
         [r.first, r.last | [[h, v]]]
      else
         [r.first | [[k, v]], r.last]
      end
   end
   headers.each { |(name, value)| header(name, value) }

   @response = delete(path)
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
