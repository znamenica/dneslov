class Markup < ActiveRecord::Base
   extend TotalSize

   belongs_to :scriptum
   belongs_to :reading
   acts_as_list scope: :reading
end
