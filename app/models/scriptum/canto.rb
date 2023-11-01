class Canto < Scriptum
   TYPES = %w(Canto Chant Canticle Orison Magnification Prayer Irmos IkosTroparion
              Stichira Kontakion Exapostilarion SessionalHymn Kanonion Kathismion
              Polileosion Apostichus CryStichira Stichiron)

   has_many :service_scripta, inverse_of: :scriptum, foreign_key: :scriptum_id
   has_many :services, through: :service_scripta

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
