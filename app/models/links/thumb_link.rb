class ThumbLink < Link
   belongs_to :info, polymorphic: true

   has_many :descriptions, as: :describable, dependent: :destroy

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   validates :url, uri: { allow_redirect: true }
   validates :descriptions, associated: true ;end
