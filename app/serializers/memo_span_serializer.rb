class MemoSpanSerializer < MemoSerializer
   attributes :id, :event, :calendary, :url

   def event
      object.event.kind_name_for( locales ).text ;end

   def calendary
      object.calendary.name_for( locales ).text ;end

   def url
      (object.link_for( locales ) || object.calendary.link_for( locales ))&.url ;end;end
