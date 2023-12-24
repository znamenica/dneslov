Допустим('єствує памѧть {string}') do |string|
   FactoryBot.create(:memory, short_name: string)
end

Допустим('єствує личинка сѫ даными:') do |table|
   attrs = table.rows_hash.transform_values { |value| YAML.load(value) }
   @current = FactoryBot.create(:thumb, attrs)
end

Пусть('єствує {string} личинка') do |count|
   FactoryBot.create_list(:thumb, count.to_i)
end

Допустим('єствує сꙛбытие {string} ѫ памѧти {string}') do |event_name, short_name|
   FactoryBot.create(:event, title: event_name, memory_title: short_name)
end

Допустим('єствує сꙛбытие {string} сꙛ озом {string} ѫ памѧти {string}') do |event_name, id, short_name|
   FactoryBot.create(:event, id: id, title: event_name, memory_title: short_name)
end

Пусть('не єствує ни єдне личинке') do
   Thumb.destroy_all
end

То('изнахоѕь личинци для {string} бѫдє яко:') do |name, doc_string|
   thumb = Thumb.by_thumbable_name(name).order(:updated_at).last
   expect(thumb).to match_record_yaml(doc_string)
end

Если('запытаю створенје изнахоѕи личинци {string} сꙛ даными:') do |path, table|
   attrs = FactoryBot.attributes_for(:thumb, table.rows_hash.transform_values { |value| YAML.load(value) })
   @response = post(path, { thumb: attrs })
end

Если('запытаю одсланје личинке в изнаходь {string} сꙛ даными:') do |path, table|
   attrs = FactoryBot.attributes_for(:thumb, table.rows_hash.transform_values { |value| YAML.load(value) })
   @response = put(path, { thumb: attrs })
end

То('личинка {string} не будє єствовати') do |name|
   thumb = Thumb.by_thumbable_name(name).first
   expect(thumb).to be_blank
end
