Допустим('есть событие {string} для памяти {string}') do |title, memory_title|
   FactoryBot.create(:event, title: title, memory_title: memory_title)
end

Если(/^попробуем создать новое событие с неверным описанием$/) do
   sample { try_create :event, :with_invalid_description }
end
