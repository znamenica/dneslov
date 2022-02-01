class Service < ActiveRecord::Base
   include Languageble

   belongs_to :info, polymorphic: true

   has_many :service_scripta
   has_many :scripta, through: :service_scripta
   has_many :canto, through: :service_scripta, source: :scriptum
   has_many :chants, through: :service_scripta, source: :scriptum
   has_many :orisons, through: :service_scripta, source: :scriptum
   has_many :canticles, through: :service_scripta, source: :scriptum

   has_alphabeth on: :name

   accepts_nested_attributes_for :chants, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :orisons, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :canticles, reject_if: :all_blank, allow_destroy: true

   validates :name, :language_code, :info, presence: true
end
