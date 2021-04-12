class Admin::ShortOrderSerializer < CommonCalendarySerializer
   attributes :id, :order

   def order
      object._descriptions.find {|d| locales.include?(d["language_code"].to_sym) }["text"] ;end;end
