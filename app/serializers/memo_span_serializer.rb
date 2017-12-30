class MemoSpanSerializer < MemoSerializer
   attributes :id, :event, :calendary, :url

   def event
      object.event.kind_for( locales ).text ;end

   def calendary
      object.calendary.name_for( locales ).text ;end

   def url
      (object.links.first || object.calendary.links.first)&.url ;end;end
