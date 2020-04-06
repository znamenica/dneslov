import { merge } from 'merge-anything'

const Validation = {
   getValidations() {
      if (!this.validations) {
         this.validations = this.props.validations || {}
      }

      console.debug("[getValidations] > ", this.validations, this.props.validations)

      return this.validations
   },

   getErrorText(value_in, context_in = {}) {
      let context = merge(this.props.validation_context || {}, context_in),
          errors = [],
          value = value_in || ''

      Object.entries(this.getValidations()).forEach(([e, rule]) => {
         console.debug("[getErrorText] > rule:", rule.constructor.name, "error:", e)
         switch(rule.constructor.name) {
         case 'RegExp':
            switch(value.constructor.name) {
            case 'Object':
               let error = Object.values(value).reduce((res, v) => {
                  return res ||
                     typeof v.match !== "undefined" &&
                     v.match(rule) && e }, undefined)

               if (error) {
                  errors.push(e)
               }
               break
            case 'String':
               if (typeof value.match !== "undefined" && value.match(rule)) {
                  errors.push(e)
               }
            }
            break
         case 'Array':
            if (rule[0] === '!' && !value.match(rule[1])) {
               errors.push(e)
            }
            break
         case 'Function':
            console.debug("[getErrorText] > value_in", value_in, "context:", context)
            if (rule(value_in, context)) {
               errors.push(e)
            }
         }
      })

      console.debug("[getErrorText] >>> ", errors[0])

      return errors[0]
   },
}

export default Validation
