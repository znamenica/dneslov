Допустим('есть личинка {string} для события {string}') do |uid, event_title|
   FactoryBot.create(:thumb, uid: uid, event_title: event_title)
end

То('свойство {string} личинки {string} не может быть пустым') do |attr, uid|
   thumb = Thumb.by_uid(uid).first
   expect(thumb).to validate_presence_of(attr.to_sym)
end

То('свойство {string} личинки {string} есть отношение к описываемому') do |prop, uid|
   thumb = Thumb.by_uid(uid).first
   expect(thumb).to belong_to(prop)
end

Допустим('создадим новую личинку с полями:') do |table|
   attrs = table.rows_hash.map { |attr, value| [ attr, YAML.load(value) ] }.to_h
   FactoryBot.create(:thumb, attrs)
end

То('личинка {string} будет существовать') do |uid|
   thumb = Thumb.by_uid(uid).first
   expect(thumb).to be_present
end
