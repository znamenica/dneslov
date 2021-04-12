class Admin::CalendarySerializer < CommonCalendarySerializer
   attributes :id, :slug, :language_code, :language, :alphabeth_code, :alphabeth, :author_name, :date, :council, :licit,
              :titles, :descriptions, :wikies, :beings

   def date
      object.date; end

   def language
      object._language ;end

   def alphabeth
      object._alphabeth ;end

   def titles
      object._descriptions.select { |d| d['type'] == 'Appellation' } ;end

   def descriptions
      object._descriptions.select { |d| d['type'] == 'Description' } ;end

   def wikies
      object._links.select { |l| l['type'] == 'WikiLink' } ;end

   def beings
      object._links.select { |l| l['type'] == "BeingLink" } ;end

   def slug
      object._slug ;end;end
