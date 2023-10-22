Допустим(/^есть памятное имя (.*) относящееся к памяти "([^"]*)"$/) do |nametext, short_name|
   memory = Memory.where( short_name: short_name ).first
   nomen = Name.where( text: nametext ).first.nomina.first
   find_or_create MemoryName, nomen: nomen, memory: memory, state_code: :наречёное
end

То(/^свойств[ао] '(.*)' памятного имени "([^"]*)" явля[юе]тся отношением$/) do |attrs, nametext|
   nomen = Name.where(text: nametext).first.nomina.first
   memory_name = MemoryName.where(nomen: nomen).first
   attrs.split( /,\s*/ ).each do |attr|
      expect( memory_name ).to belong_to( attr.to_sym )
   end
end

То(/^свойства '(.*)' памятного имени "([^"]*)" не могут быть пустыми$/) do |attrs, nametext|
   nomen = Name.where(text: nametext).first.nomina.first
   memory_name = MemoryName.where(nomen: nomen).first
   attrs.split( /,\s*/ ).each do |attr|
      expect( memory_name ).to validate_presence_of( attr.to_sym )
   end
end

То(/^свойство '(.*)' памятного имени "([^"]*)" является перечислителем$/) do |attr, nametext|
   nomen = Name.where(text: nametext).first.nomina.first
   memory_name = MemoryName.where(nomen: nomen).first
   expect( memory_name ).to define_enum_for( attr.to_sym )
end
