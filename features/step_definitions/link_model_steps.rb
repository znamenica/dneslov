Допустим(/^есть иконная ссылка "([^"]*)" без описания$/) do |url|
   FactoryBot.create(:icon_link, :without_descriptions, :without_validations, url: url)
end

Если(/^попробуем создать новую иконную ссылку "([^"]*)" с неверным описанием$/) do |url|
   sample { try_create :icon_link, :with_invalid_description, url: url }
end
