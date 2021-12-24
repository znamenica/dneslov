Допустим(/^есть календарь "([^"]*)"$/) do |slug|
   create( :calendary, slug: slug )
end

Допустим(/^попробуем создать календарь "([^"]*)"$/) do |slug|
   sample { try_create( :calendary, slug: slug ) }
end

Допустим(/^попробуем создать календарь "([^"]*)" без описания$/) do |slug|
   sample { try_create( :calendary, slug: slug, descriptions: false, titles: false ) }
end

Если(/^попробуем создать новый календарь "([^"]*)" с неверным описанием$/) do |slug|
   sample { try_create :calendary, :with_invalid_description, slug: slug }
end

То(/^у модели есть действенным многоимущее свойство "([^"]*)"$/) do |prop|
   expect( subject ).to have_many( prop )
end

То(/^у модели суть действенными многоимущие свойства:$/) do |table|
   table.hashes.each do |hash|
      expect( subject ).to have_many( hash[ "свойства" ] || hash[ "свойство" ] )
         .class_name( model_of( hash[ "имя рода" ] ) )
         .dependent( hash[ "зависимость" ] )
   end
end

Если(/^создадим календарь "([^"]*)"$/) do |slug|
   FactoryBot.create( :calendary, slug: slug )
end

То(/^календарь "([^"]*)" будет иметь "([^"]*)" описание$/) do |slug, count|
   exa = Calendary.includes( :slug ).where( slugs: { text: slug } ).first
   expect( exa.descriptions.count ).to be_eql( count.to_i )
end

То(/^календарь "([^"]*)" будет иметь "([^"]*)" титул$/) do |slug, count|
   exa = Calendary.includes(:slug).where(slugs: { text: slug }).first
   expect(exa.titles.count).to be_eql(count.to_i)
end
