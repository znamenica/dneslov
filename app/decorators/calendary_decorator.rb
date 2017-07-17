class CalendaryDecorator < ApplicationDecorator
   delegate_all

   def chip_for locales, action = 'add'
      slugged_chip( slug_path( slug.text ),
                    name_for( locales )&.text || slug.text,
                    color_by_slug( slug.text ),
                    action ) ;end;end
