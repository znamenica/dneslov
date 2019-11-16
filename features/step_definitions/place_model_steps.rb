Если(/^попробуем создать новое место без описаний$/) do
   sample { create :place, descriptions: [] } ;end

Если(/^попробуем создать новое место с неверным описанием$/) do
   sample { create :place,
      descriptions: FactoryBot.build_list( :invalid_description, 1 ) } ;end
