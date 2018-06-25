class TitleSerializer < ApplicationSerializer
   attributes :text, :calendary

   def text
      object.text ;end

   def calendary
      object.describable&.calendary&.slug&.text ;end;end
