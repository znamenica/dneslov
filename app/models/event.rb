# kind[string]   наименование класса события
# memory_id[int] id памяти, событие которой произошло
# place_id[int]  id места, где произошло событие
# item_id[int]   id предмета, к которому применяется событие
#    t.string "happened_at"
#    t.string "kind", null: false
#    t.string "person_name"
#    t.integer "type_number"
#    t.string "order"
#    t.string "council"
#
class Event < ActiveRecord::Base
   extend Informatible

   NOTICE = [
      'Repose',
      'Veneration',
      'Writing',
      'Appearance',
      'Council',
      'Miracle',
   ]

   USUAL = [
      'Marriage',
      'Exaltation',
      'Ascension',
      'Restoration',
      'Resurrection',
      'Entrance',
      'Conception',
      'Protection',
      'Conceiving',
      'Writing',
      'Sanctification',
      'Uncovering',
      'Circumcision',
      'Revival',
      'Renunciation',
      'Placing',
      'Translation',
      'Adoration',
      'Transfiguration',
      'Repose',
      'Nativity',
      'Council',
      'Meeting',
      'Passion',
      'Supper',
      'Assurance',
      'Miracle',
      'Appearance',
   ]

   belongs_to :memory
   belongs_to :place, optional: true
   belongs_to :item, optional: true
   belongs_to :subject, primary_key: :key, foreign_key: :kind

   has_many :memos, dependent: :delete_all do
      def for calendary_slugs
         calendary_ids = Calendary.by_slugs(calendary_slugs).unscope(:select).select(:id)
         self.where(calendary_id: calendary_ids) ;end;end

   has_one :coordinate, as: :info, inverse_of: :info, class_name: :CoordLink
   has_many :calendaries, -> { distinct }, through: :memos
   has_many :titles, -> { title }, as: :describable, class_name: :Description do
      def with_default this
        self.or( Appellation.merge( this.subject.names ))
           .order( :describable_type ).distinct ;end;end

   has_many :default_titles, -> { distinct }, through: :subject, source: :names, class_name: :Appellation
   has_many :all_titles, ->(this) do
      where( describable_type: "Event", describable_id: this.id, kind: "Title" )
        .or( Appellation.merge(this.subject.names) )
     .order( :describable_type )
   end, primary_key: nil, class_name: :Description

   # synod : belongs_to
   # czin: has_one/many
   default_scope -> { order(:created_at) }

   scope :notice, -> { where(kind: NOTICE) }
   scope :usual, -> { where(kind: USUAL) }
   scope :memoed, -> { joins( :memos ).distinct }
   scope :with_token, -> text do
      left_outer_joins( :subject, :titles ).
         where("events.kind ~* ?", "\\m#{text}.*").or(
         where(type_number: text.to_i).or(
         where("descriptions.text ~* ?", "\\m#{text}.*"))) ;end
   scope :with_memory_id, -> memory_id do
      where(memory_id: memory_id) ;end

   accepts_nested_attributes_for :place
   accepts_nested_attributes_for :coordinate
   accepts_nested_attributes_for :item, reject_if: :all_blank
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :mid, :with_memory_id)

   validates_presence_of :subject, :kind

   def year_date_for calendary_slugs, date_in, julian
      return nil if date_in.blank?

      date = date_in.is_a?(Time) && date_in || Time.parse(date_in)
      year_date = memos.for(calendary_slugs).first&.year_date
      if /(?<day>\d+)\.(?<month>\d+)%(?<weekday>\d+)$/ =~ year_date
         base_date = Date.parse("#{date.year}-#{month}-#{day}")
         base_offset = weekday.to_i - base_date.wday
         (base_date + (base_offset < 1 && (base_offset + 7) || base_offset)).strftime("%d.%m")
      elsif /(?<offset>[+-]\d+)/ =~ year_date
         gap = (julian && 13.days || 0)
         easter = WhenEaster::EasterCalendar.find_greek_easter_date(date.year) - gap
         (easter + offset.to_i.days).strftime("%d.%m")
      else
         year_date ;end;end

   def title_for language_code
     titles.with_default(self).where(language_code: language_code).first ;end

   def memo_in_calendary calendary
      memos.where( calendary_id: calendary ) ;end

   def kind_name_for language_code
      subject.names.where( language_code: language_code ).first ;end

   def memo_description_for language_code, calendary_slugs
      memos.for(calendary_slugs).first&.description_for( language_code ) ;end

   def description_for language_code
      descriptions.where(language_code: language_code).first ;end

   def troparions text_present = true
      relation = Troparion.joins( :services ).where( services: { id: services.pluck( :id ) } )
      text_present && relation.where.not( { text: nil } ) || relation ;end

   def troparions_for language_code, text_present = true
      troparions( text_present ).where(language_code: language_code) ;end

   def kontakions text_present = true
      relation = Kontakion.joins( :services ).where( services: { id: services.pluck( :id ) } )
      text_present && relation.where.not( { text: nil } ) || relation ;end

   def kontakions_for language_code, text_present = true
      kontakions( text_present ).where(language_code: language_code) ;end

   # serialization
   def happened_at= value
      value.is_a?(Array) && super(value.join('/')) || super
   end

   def happened_at
      value = read_attribute(:happened_at)
      value.to_s =~ /,/ && value.split(/,\*/) || value ;end;end
