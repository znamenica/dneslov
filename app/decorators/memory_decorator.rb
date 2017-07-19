class MemoryDecorator < ApplicationDecorator
   delegate_all

   decorates_association :calendaries
   decorates_association :memos

   def date
      # TODO if no proper event, just skip, remove then
      year = (filtered_events.first.try(:happened_at) || "").split(".").last
      year&.strip ;end

   def council_chips
      council.split(',').map do |council|
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         slugged_chip( nil, pure_council ) end
      .join.html_safe ;end

   def memos_present?
      object.memos.includes(:calendary).any? { | memo | memo.calendary } ;end

   def grouped_calendaries
      memos.group_by do |memo|
         #TODO blank calendary
         memo.calendary
      end.map do |(calendary, memos)|
         calendary && [ calendary.decorate, memos.sort ] || nil
      end.compact.to_h ;end

   def default_icon_url
      self.valid_icon_links.first&.url ;end

   def chip
      # slugged_chip( slug_path( order ), order, color_by_slug( slug.text ), slug.text ) ;end;end #TODO
      slugged_chip( nil, order, color_by_slug( slug.text ), slug.text ) ;end;end
