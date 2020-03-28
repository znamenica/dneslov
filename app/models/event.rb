# type[string]   наименование класса события
# memory_id[int] id памяти, событие которой произошло
# place_id[int]  id места, где произошло событие
# item_id[int]   id предмета, к которому применяется событие
#    t.string "happened_at"
#    t.string "type", null: false
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

   has_many :memos, dependent: :delete_all
   has_one :coordinate, as: :info, inverse_of: :info, class_name: :CoordLink
   has_many :kinds, foreign_key: :kind, primary_key: :type, class_name: :EventKind

   belongs_to :memory
   belongs_to :place, optional: true
   belongs_to :item, optional: true

   # synod : belongs_to
   # czin: has_one/many
   default_scope -> { order(:created_at) }

   scope :notice, -> { where(type: NOTICE) }
   scope :usual, -> { where(type: USUAL) }
   scope :with_token, -> text do
      left_outer_joins(:kinds).where("type ILIKE ?", "%#{text}%").or(where(type_number: text.to_i).or(where("event_kinds.text ILIKE ?", "%#{text}%"))) ;end
   scope :with_memory_id, -> memory_id do
      where(memory_id: memory_id) ;end

   accepts_nested_attributes_for :place
   accepts_nested_attributes_for :coordinate
   accepts_nested_attributes_for :item, reject_if: :all_blank

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :mid, :with_memory_id)

   validates_presence_of :kinds, :type

   def kind_for language_code
      kinds.where(language_code: language_code).first ;end

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
