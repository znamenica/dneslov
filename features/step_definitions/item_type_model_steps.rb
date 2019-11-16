Если(/^попробуем создать новый тип предмета без описаний$/) do
   sample { try_create :item_type, ru_description: false }
end

Если(/^попробуем создать новый тип предмета с неверным описанием$/) do
   sample { try_create :item_type,
      descriptions: FactoryBot.build_list( :invalid_description, 1 ) }
end
