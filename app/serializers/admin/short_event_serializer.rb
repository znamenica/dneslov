class Admin::ShortEventSerializer < CommonCalendarySerializer
   attributes :id, :event
   
   def event
      object._titles.find {|t| locales.include?(t["language_code"].to_sym) }["text"] ;end;end
