class Description < ActiveRecord::Base
   extend Language

   belongs_to :describable, polymorphic: true

   has_alphabeth on: :text

   scope :desc, -> { where(type: 'Description') }
   scope :title, -> { where(type: 'Title') }
   scope :appe, -> { where(type: 'Appellation') }
   scope :with_lang, ->(lang) { where(language_code: lang) }
   scope :with_languaged_calendary, ->(calendary_slug, language_code) do
      self.joins(', memoes')
          .where(language_code: language_code,
                 describable_type: 'Memo')
          .merge(Memo.in_calendaries(calendary_slug)).distinct ;end

   scope :all_by_memory, ->(memory) do
      ids = memory.memos.select(:id).notice

      self.where(describable_type: "Memo",
                 describable_id: ids) ;end

   before_create -> { self.type ||= 'Description' }

   validates :text, :language_code, :alphabeth_code, presence: true ; end
