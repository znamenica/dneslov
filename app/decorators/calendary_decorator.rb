class CalendaryDecorator < ApplicationDecorator
   delegate_all

   def chip_for locales, action = 'add', action_class = ''
      slugged_chip( slug_path( slug.text ),
                    name_for( locales )&.text || slug.text,
                    color_by_slug( slug.text ),
                    slug.text,
                    action,
                    action_class,
                    'calendary' ) ;end;end
