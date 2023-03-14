class Link < ActiveRecord::Base
   belongs_to :resource, inverse_of: :links, optional: true

   validates :type, :info_type, presence: true

   scope :resourced, -> do
      where.not(resource_id: nil)
   end
end
