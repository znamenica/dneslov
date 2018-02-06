class Description < ActiveRecord::Base
   extend Language

   belongs_to :describable, polymorphic: true

   has_alphabeth on: :text

   scope :with_languaged_calendary, ->(calendary_slug, language_code) do
      Description.joins(', memoes')
                 .where(language_code: language_code,
                        describable_type: 'Memo',
                        type: nil)
                 .merge(Memo.in_calendaries(calendary_slug)).distinct
   end

   validates :text, :language_code, :alphabeth_code, presence: true ; end
