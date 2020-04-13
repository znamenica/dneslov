class EventSerializer < ApplicationSerializer
   attributes :id, :yeardate, :kind_name, :title, :happened_at, :description, :place, :troparion, :kontakion

   def yeardate
     object.yeardate_for( locales, memos ) ;end

   def kind_name
      object.kind_for( locales )&.text ;end

   def title
      object.title_for( locales )&.text ;end

   def description
      object.description_for( locales )&.text ;end

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
