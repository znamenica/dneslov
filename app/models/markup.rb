class Markup < ActiveRecord::Base
   extend TotalSize
   extend AsJson

   belongs_to :scriptum
   belongs_to :reading
   acts_as_list scope: :reading
end
