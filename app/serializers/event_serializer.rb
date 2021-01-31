class EventSerializer < ApplicationSerializer
   attributes :id, :memoes, :kind_code, :titles, :happened_at, :description, :place, :cantoes

   def cantoes
      object._cantoes ;end

   def memoes
      object._memoes.map do |yd|
         yd.merge( 'yd_parsed' => Event.year_date_for( yd[ 'year_date' ], date, julian )) ;end;end

   def titles
      object._titles ;end

   def description
      object._description ;end

   def place
      if object._place['id'].present?
         object._place end;end;end
