class Note < Description
   validates_length_of :text, in: 5..980, allow_blank: false
end
