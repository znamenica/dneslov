class EventSerializer < ApplicationSerializer
   attributes :id, :yeardate, :kind_name, :title, :happened_at, :description, :place, :troparion, :kontakion
   #TODO
   def is_general
     Event::NOTICE.include?(object.kind) ;end

   def yeardate
     object.year_date_for( calendary_slugs, date, julian ) ;end

   def kind_name
      object.kind_name_for( locales )&.text ;end

   def title
      object.title_for( locales )&.text ;end

   def description
      if !is_general
         object.memo_description_for( locales, calendary_slugs )&.text ;end;end

   def place
      object.place&.description_for( locales )&.text ;end

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
