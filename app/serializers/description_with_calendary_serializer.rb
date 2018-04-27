class DescriptionWithCalendarySerializer < ApplicationSerializer
  attributes :text, :calendary

  def calendary
     if object.describable.is_a?( Memo )
        data = BaseCalendarySerializer.new( object.describable.calendary, locales: locales ).as_json
        link = object.describable.link_for( locales )
        if link
           data[ :url ] = link.url ;end

        data ;end;end;end
