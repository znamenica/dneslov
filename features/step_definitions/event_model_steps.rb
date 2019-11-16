Если(/^попробуем создать новое событие с неверным описанием$/) do
   sample { create :event, :with_invalid_description } ; end

Допустим(/^есть русское место "([^"]*)"$/) do |place|
   FactoryBot.create( :place, ru_description: place ) ;end
