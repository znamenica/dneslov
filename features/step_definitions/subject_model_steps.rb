Допустим("есть язык {string}") do |string|
   FactoryBot.create( :language, key: string  ) end

Допустим("есть алфавит {string}") do |string|
   FactoryBot.create( :alphabeth, key: string  ) end

Допустим("есть событие {string}") do |string|
   FactoryBot.find_build( :event_kind, key: string  ).save! end

Допустим("есть события {string}") do |string|
   string.split(",").each do |key|
      FactoryBot.find_build( :event_kind, key: key.strip ).save! end;end

Допустим("есть вид имени {string}") do |string|
   FactoryBot.find_build( :name_kind, key: string  ).save! end

Допустим("есть виды имени {string}") do |string|
   string.split(",").each do |key|
      FactoryBot.find_build( :name_kind, key: key.strip ).save! end;end

Допустим("есть вид связки имени {string}") do |string|
   FactoryBot.find_build( :name_bind, key: string  ).save! end

Допустим("есть виды связки имени {string}") do |string|
   string.split(",").each do |key|
      FactoryBot.find_build( :name_kind, key: key.strip ).save! end;end
