require 'when_easter'

class CalendaryDecorator < ApplicationDecorator
   delegate_all

   def chip_for locales
      slugged_chip( slug_path( slug.text ),
                    name_for( locales )&.text || slug.text,
                    color_by_slug( slug.text ),
                    'add' ) ;end;end
