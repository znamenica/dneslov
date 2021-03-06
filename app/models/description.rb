class Description < ActiveRecord::Base
   include Languageble

   has_alphabeth on: :text

   belongs_to :describable, polymorphic: true
   belongs_to :memo, foreign_key: :describable_id, foreign_type: :describable_type, class_name: :Memo

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

   scope :first_in_calendary, -> do
      ids = Memo.select(:id).notice.first_in_calendary

      self.where(describable_type: "Memo",
                 describable_id: ids) ;end

   validates :text, :language_code, :alphabeth_code, presence: true

   before_save -> { self.type ||= 'Description' }, on: :create end
