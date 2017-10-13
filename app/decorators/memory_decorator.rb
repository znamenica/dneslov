class MemoryDecorator < ApplicationDecorator
   delegate_all

   decorates_association :calendaries
   decorates_association :memos

   def memos_present?
      object.memos.includes(:calendary).any? { | memo | memo.calendary } ;end

   def grouped_calendaries
      memos.group_by do |memo|
         #TODO blank calendary
         memo.calendary
      end.map do |(calendary, memos)|
         calendary && [ calendary.decorate, memos.sort ] || nil
      end.compact.to_h ;end

   def described_icon_links
      @described_icon_links ||= self.valid_icon_links ;end
   ;end


