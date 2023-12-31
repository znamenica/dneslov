То('свойство {string} связности картинки {string} есть отношение к описываемому') do |attr, title|
   picture = Picture.by_title(title).first
   expect(picture.attitudes.first).to belong_to(attr)
end
