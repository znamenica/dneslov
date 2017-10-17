class CalendarySerializer < CommonCalendarySerializer
   attributes :dates

   def dates
      memos = @instance_options[ :memos ] || object.memos
      MemosSerializer.new( memos, locales: locales ) ;end;end
