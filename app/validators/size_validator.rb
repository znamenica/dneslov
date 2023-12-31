class SizeValidator < ActiveModel::EachValidator
   def validate_each(record, attribute, value)
      options.each do |(type, sub_options)|
         value_in =
            case type
            when :width, :height
               value.send(type)
            when :ratio
               value.width.to_f / value.height.to_f
            else
               next
            end

         sub_options.each do |(kind, cond)|
            case kind
            when :min
               if value_in < cond
                  record.errors.add(attribute,
                                    :invalid_dimension,
                                    message: I18n.t("activerecord.errors.size.#{type}.#{kind}", cond: cond, value: value_in))
               end
            when :max
               if value_in > cond
                  record.errors.add(attribute,
                                    :invalid_dimension,
                                    message: I18n.t("activerecord.errors.size.#{type}.#{kind}", cond: cond, value: value_in))
               end
            when :range
               unless cond === value_in
                  record.errors.add(attribute,
                                    :invalid_dimension,
                                    message: I18n.t("activerecord.errors.size.#{type}.#{kind}", cond: cond, value: value_in))
               end
            else
               record.errors.add(attribute,
                                 :invalid_option,
                                 message: I18n.t("activerecord.errors.size.#{type}.option", cond: cond))
            end
         end
      end if value&.present?
   end
end
