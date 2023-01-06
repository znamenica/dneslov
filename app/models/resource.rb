class Resource < ApplicationRecord
   has_many :links, validate: true, inverse_of: :resource

   scope :unassigned, ->() do
      where.not(id: Link.resourced.select(:resource_id))
   end

   scope :image, ->() do
      json_re = '$.** ? (@ like_regex "(thumb|icon|both)")'
      where("jsonb_path_exists(resources.props, '#{json_re}')")
   end
end
