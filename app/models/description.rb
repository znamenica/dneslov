class Description < ActiveRecord::Base
   include Languageble

   has_alphabeth on: :text

   belongs_to :describable, polymorphic: true
   belongs_to :memo, polymorphic: true, foreign_key: :describable_id, foreign_type: :describable_type, class_name: :Memo

   scope :desc, -> { where(type: 'Description') }
   scope :title, -> { where(type: 'Title') }
   scope :appe, -> { where(type: 'Appellation') }
   scope :descnote, -> { where(type: ['Description', 'Note'])}
   scope :annotated, -> { order(Arel.sql('length(text) ASC')).limit(1) }
   scope :by_language, ->(language) { where(language_code: language) }
   scope :by_relation, ->(join_name, model) do
      self.
         joins(', memoes').
         where(Arel.sql("describable_id = #{join_name}.id")).
         and(where(describable_type: model.to_s))
   end

   scope :by_languaged_calendary, ->(calendary_slug, language_code) do
      self.joins(', memoes')
          .where(language_code: language_code,
                 describable_type: 'Memo')
          .merge(Memo.in_calendaries(calendary_slug)).distinct
   end

   scope :all_by_memory, ->(memory) do
      ids = memory.memos.select(:id).notice

      self.where(describable_type: "Memo",
                 describable_id: ids)
   end

   scope :first_in_calendary, -> do
      ids = Memo.select(:id).notice.first_in_calendary

      self.where(describable_type: "Memo",
                 describable_id: ids)
   end

   validates :text, :language_code, :alphabeth_code, presence: true

   before_create -> { self.type ||= 'Description' }

   before_validation :fill_in_la

   def fill_in_la
      if text && !(self.language_code && self.alphabeth_code)
         self.language_code, self.alphabeth_code = Languageble.la_for_string(text)
      end
   end
end
