class Admin::ShortCalendarySerializer < CommonCalendarySerializer
   attributes :id, :calendary
   
   def calendary
      object._descriptions.find do |d|
         d["type"] == "Appellation" &&
         locales.include?(d["language_code"].to_sym)
         end["text"] ;end;end
