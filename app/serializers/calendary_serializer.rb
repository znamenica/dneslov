class CalendarySerializer < CommonCalendarySerializer
   attributes :name, :url, :color, :slug, :dates

   def name
      object.name_for( locales )&.text ;end

   def url
      object.links.first&.url ;end

   def slug
      object.slug.text ;end

   def color
      color_by_slug( slug ) ;end

   def dates
      memos = @instance_options[ :memos ] || object.memos
      MemosSerializer.new( memos, locales: locales ) ;end;end
