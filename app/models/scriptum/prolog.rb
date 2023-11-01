class Prolog < Scriptum
   has_many :service_scripta, inverse_of: :scriptum, foreign_key: :scriptum_id
   has_many :services, through: :service_scripta
end
