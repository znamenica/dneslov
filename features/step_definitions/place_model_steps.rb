Если(/^попробуем создать новое место без описаний$/) do
   sample { try_create :place, ru_description: false } ;end

Если(/^попробуем создать новое место с неверным описанием$/) do
   sample { try_create :place,
      descriptions: FactoryBot.build_list( :invalid_description, 1 ) } ;end
