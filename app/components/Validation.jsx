import * as assign from 'assign-deep'

const Validation = {
   getValidations() {
      if (!this.validations) {
         this.validations = assign({}, this.constructor.validations, this.props.validations)
      }

      return this.validations
   },

   getErrorText(value_in, context_in = {}) {
      let context = assign({}, this.constructor.validation_context, context_in),
          error = null,
          value = value_in || ''

      Object.entries(this.getValidations()).forEach(([e, rule]) => {
         switch(rule.constructor.name) {
         case 'RegExp':
            switch(value.constructor.name) {
            case 'Object':
               //console.log(value, Object.values(value))
               //console.log(Object.values(value).forEach((v) => { console.log(typeof v.match !== "undefined", rule, v, typeof v.match !== "undefined" && v.match(rule), e) }))
               error = Object.values(value).reduce((res, v) => { return res || typeof v.match !== "undefined" && v.match(rule) && e }, undefined)
               break
            case 'String':
               if (typeof value.match !== "undefined" && value.match(rule)) {
                  error = e
               }
            }
            break
         case 'Array':
            if (rule[0] === '!' && !value.match(rule[1])) {
               error = e
            }
            break
         case 'Function':
            console.log(value_in, rule)
            if (rule(value_in, context)) {
               error = e
            }
         }
      })

      return error
   },
}

export default Validation
