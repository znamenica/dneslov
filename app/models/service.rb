class Service < ActiveRecord::Base
   include Languageble

   belongs_to :info, polymorphic: true

   has_many :service_cantoes, dependent: :delete_all
   has_many :cantoes, through: :service_cantoes, dependent: :destroy
   has_many :chants, through: :service_cantoes, foreign_key: :canto_id, source: :canto, dependent: :destroy
   has_many :orisons, through: :service_cantoes, foreign_key: :canto_id, source: :canto, dependent: :destroy
   has_many :canticles, through: :service_cantoes, foreign_key: :canto_id, source: :canto, dependent: :destroy

   has_alphabeth on: :name

   accepts_nested_attributes_for :cantoes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :chants, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :orisons, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :canticles, reject_if: :all_blank, allow_destroy: true

   validates :name, :language_code, :info, presence: true ;end
