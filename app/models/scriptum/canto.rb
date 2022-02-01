class Canto < Scriptum
   TYPES = %w(Canto Chant Canticle Orison Magnification Prayer Irmos IkosTroparion
              Stichira Kontakion Exapostilarion SessionalHymn Kanonion Kathismion
              Polileosion Apostichus CryStichira Stichiron)

   has_many :service_scripta, inverse_of: :scriptum
   has_many :services, through: :service_scripta
   has_many :scriptum_memories, inverse_of: :scriptum
   has_many :memories, through: :scriptum_memories
   has_many :targets, through: :scriptum_memories, foreign_key: :memory_id, source: :memory

   has_alphabeth on: %i(prosomeion_title)

   def targets= value
      if value.kind_of?( Array )
         new_value = value.map do |v|
            if v.kind_of?(String) && v =~ /^\^(.*)/
               Memory.where(short_name: $1).first
            else
               v ;end;end
            .compact
         super(new_value)
      else
         super
      end
   end
end
