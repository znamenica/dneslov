class Link < ActiveRecord::Base
   include Languageble

   belongs_to :resource, inverse_of: :links, optional: true

   has_alphabeth novalidate: true

   validates :type, :info_type, presence: true

   scope :resourced, -> do
      where.not(resource_id: nil)
   end
end
