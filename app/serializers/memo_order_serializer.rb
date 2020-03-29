class MemoOrderSerializer < ApplicationSerializer
   attributes :id, :order_id, :order

   def order
     object.order.note_for( locales ).text ;end;end
