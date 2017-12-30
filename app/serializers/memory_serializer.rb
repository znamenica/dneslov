class MemorySerializer < CommonMemorySerializer
   attributes :names, :beings, :wikies,:paterics, :memos, :icons, :events, :troparion, :kontakion

   def link_text link
      /https?:\/\/(?<domains>[a-zA-Z0-9_\.-]+)\.[\w]+\// =~ link
      domains.split(".").sort_by { |d| d.size }.last ;end

   def links_json links
      ( links || [] ).map.with_index do | link, index |
         {
            id: index,
            text: link_text( link.url ),
            url: link.url,
         } ;end;end

   def memos_present?
      object.memos.includes(:calendary).any? { | memo | memo.calendary } ;end

   def names
      MemoryNamesSerializer.new(object.memory_names, locales: locales) ;end

   def beings
      links_json( object.beings_for( locales )) ;end

   def wikies
      links_json( object.wikies_for( locales )) ;end

   def paterics
      links_json( object.paterics_for( locales )) ;end

   def memos
      MemoedCalendariesSerializer.new(object.memos, locales: locales) ;end

   def icons
      object.valid_icon_links.map.with_index do | icon, index |
         {
            id: index,
            description: icon.description_for( locales )&.text,
            url: icon.url,
         } ;end;end

   def events
      ActiveModel::Serializer::CollectionSerializer.new(object.events.usual, locales: locales) ;end

   def troparion
      if troparion = object.troparions_for( locales ).first
         title =
         if troparion.tone.present?
            t 'troparion_with_tone', tone: troparion.tone
         else
            t 'troparion' ;end
         { title: title, text: troparion.text } ;end;end

   def kontakion
      if kontakion = object.kontakions_for( locales ).first
         title =
         if kontakion.tone.present?
            t 'kontakion_with_tone', tone: kontakion.tone
         else
            t 'kontakion' ;end
         { title: title, text: kontakion.text } ;end;end;end
