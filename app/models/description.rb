class Description < ActiveRecord::Base
   extend Language

   belongs_to :describable, polymorphic: true

   has_alphabeth on: :text

   scope :with_languaged_calendary, ->(calendary_slug, language_code) do
      self.joins(', memoes')
          .where(language_code: language_code,
                 describable_type: 'Memo',
                 type: nil)
          .merge(Memo.in_calendaries(calendary_slug)).distinct ;end

   scope :all_by_memory, ->(memory) do
      ids = memory.memos.select(:id).notice

      self.where(type: nil)
        .merge(where(describable_type: "Memory",
                     describable_id: memory.id)
           .or(where(describable_type: "Memo",
                     describable_id: ids))) ;end

   validates :text, :language_code, :alphabeth_code, presence: true ; end
