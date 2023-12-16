Допустим('есть слика {string} для события {string}') do |title, event_title|
   FactoryBot.create(:picture, title: title, event_title: event_title)
end

То('свойство {string} слики {string} не может быть пустым') do |attr, title|
   picture = Picture.by_title(title).first
   expect(picture).to validate_presence_of(attr.to_sym)
end

То('у слики {string} суть действенными многоимущие свойства:') do |title, table|
   picture = Picture.by_title(title).first
   table.rows.flatten.each do |attr|
      expect(picture).to have_many(attr.to_sym)
   end
end

Допустим('создадим новую слику с полями:') do |table|
   attrs = table.rows_hash.map { |attr, value| [ attr, YAML.load(value) ] }.to_h
   FactoryBot.create(:picture, attrs)
end

То('слика {string} будет существовать') do |title|
   picture = Picture.by_title(title).first
   expect(picture).to be_present
end
