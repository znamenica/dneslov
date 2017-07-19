class CalendaryDecorator < ApplicationDecorator
   delegate_all

   def href
      calendary.links.first&.url ;end

   def s
      object.slug.text ;end

   def style
       color = color_by_slug( s )
       "background-color: ##{color};" ;end

   def chip_for locales, action = 'add', action_class = ''
      slugged_chip( slug_path( slug.text ),
                    name_for( locales )&.text || slug.text,
                    color_by_slug( slug.text ),
                    slug.text,
                    action,
                    action_class,
                    'calendary' ) ;end;end
