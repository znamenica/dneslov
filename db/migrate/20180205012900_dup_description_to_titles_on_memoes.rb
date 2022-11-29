class DupDescriptionToTitlesOnMemoes < ActiveRecord::Migration[5.2]
   def change
      #Description.where(type: nil, describable_type: 'Memo').each do |r|
      #   rr = r.dup
      #   rr.type = 'Title'
      #   rr.save! ;end
   end
end
