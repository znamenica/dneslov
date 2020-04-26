# council[string]       - соборы для памяти
# short_name[string]    - краткое имя
# covers_to_id[integer] - прокровительство
# quantity[string]      - количество
# bond_to_id[integer]   - отношение к (для икон это замысел или оригинал списка)
#
class Memory < ActiveRecord::Base
   extend DefaultKey
   extend Informatible

   has_default_key :short_name

   belongs_to :covers_to, class_name: :Place, optional: true
   belongs_to :bond_to, class_name: :Memory, optional: true

   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :memory_names, dependent: :destroy
   has_many :names, through: :memory_names
   has_many :paterics, as: :info, dependent: :destroy, class_name: :PatericLink
   has_many :events, dependent: :destroy
   has_many :memos, through: :events
   has_many :calendaries, -> { distinct.reorder('id') }, through: :memos
   has_many :photo_links, as: :info, inverse_of: :info, class_name: :IconLink, dependent: :destroy # ЧИНЬ во photos
   has_many :notes, as: :describable, dependent: :destroy, class_name: :Note
   has_many :orders, -> { distinct.reorder('id') }, through: :memos, source: :orders
   has_many :slugs, -> { distinct.reorder('id') }, through: :orders, source: :slug

   default_scope { left_outer_joins( :slug ).order( base_year: :asc, short_name: :asc, id: :asc ) }

   scope :icons, -> { joins(:slugs).where( slugs: { text: :обр } ) }

   scope :by_short_name, -> name { where( short_name: name ) }

   scope :in_calendaries, -> calendaries_in do
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      left_outer_joins( :memos ).merge( Memo.in_calendaries( calendaries )).distinct ;end

   scope :with_date, -> (date, julian = false) do
      left_outer_joins( :memos ).merge( Memo.with_date( date, julian )).distinct ;end

   scope :with_token, -> text do
      left_outer_joins(:names, :descriptions).where( "short_name ~* ?", "\\m#{text}.*" ).or(
         where("descriptions.text ~* ? OR names.text ~* ?", "\\m#{text}.*", "\\m#{text}.*")).distinct ;end

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)
   singleton_class.send(:alias_method, :d, :with_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   accepts_nested_attributes_for :memory_names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :paterics, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :events, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memos, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :photo_links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :covers_to, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank

   validates_presence_of :short_name, :events
   validates :base_year, format: { with: /\A-?\d+\z/ }

   before_create :set_slug
   before_validation :set_base_year, on: :create

   def set_base_year
      types = %w(Resurrection Repose Writing Appearance Translation Sanctification)

      event = self.events.to_a.sort_by { |x| (types.index(x.kind) || 100) }.first

      return unless event

      dates = event.happened_at.split(/[\/-]/)
      self.base_year ||=
      case dates.first
      when /([IVX]+)$/
         ($1.rom - 1) * 100 + 50
      when /\.\s*(\d+)$/
         $1
      when /(?:\A|\s|\()(\d+)$/
         $1
      when /(?:\A|\s|\(|\.)(\d+) до (?:нэ|РХ)/
         "-#{$1}"
      when /(:|сент)/
         dates.last.split(".").last
      when /давно/
         '-3760'
      else
         dates = event.happened_at.split(/[\/-]/)
         if /(?:\A|\s|\(|\.)(\d+) до (?:нэ|РХ)/ =~ dates.first
            "-#{$1}"
         else
            '0' ;end;end

   self.base_year ;end

   def self.by_slug slug
      unscoped.joins( :slug ).where( slugs: { text: slug } ).first ;end

   def all_titles_for language_code
      Description.title.all_by_memory(self).first_in_calendary.with_lang(language_code) ;end

   def all_descriptions_for language_code
      Description.desc.all_by_memory(self).first_in_calendary.with_lang(language_code) ;end

   def description_for language_code
      descriptions.with_lang(language_code).first ;end

   def beings_for language_code
      abeings = beings.where(language_code: language_code)
      abeings.present? && abeings || nil ;end

   def wikies_for language_code
      awikies = wikies.where(language_code: language_code)
      awikies.present? && awikies || nil ;end

   def paterics_for language_code
      apaterics = paterics.where(language_code: language_code)
      apaterics.present? && apaterics || nil ;end

   def valid_icon_links
      # TODO cleanup when filter for jpg/png etc will be added to model
      icon_links.where("url ~ '.(jpg|png)$'") ;end

   def filtered_events
      types = %w(Repose Appearance Miracle Writing Founding Canonization)
      # TODO optimize sort to SQL order
      events.where(kind: types).sort_by { |e| types.index( e.kind ) } ;end

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

   def set_slug
      self.slug = Slug.new(base: self.short_name) if self.slug.blank? ;end

   def to_s
      memory_names.join( ' ' ) ; end ; end
