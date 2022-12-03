module ValidationCancel
   def cancel_validates *attributes
      this = self

      attributes.select {|v| Symbol === v }.each do |attr|
         self._validate_callbacks.select do |callback|
            callback.filter.try(:attributes) == [attr]
         end.each do |vc|
            ifs = vc.instance_variable_get(:@if)
            vc.instance_variable_set(:@if, ifs | [proc { not self.kind_of?(this) }])
         end
      end
   end
end
