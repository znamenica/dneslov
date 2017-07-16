class SelectionSerializer < ActiveModel::Serializer::CollectionSerializer
   def initialize date: nil, wordline: '', calendars: nil
      words = wordline.gsub( '+', ' +' ).split( /\s+/ )
      resources = [ date, words, calendars ].flatten.compact
      super( resources, serializer: true ) ;end;end
