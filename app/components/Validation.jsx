import * as assign from 'assign-deep'

const Validation = {
   getValidations() {
      if (!this.validations) {
         this.validations = assign({}, this.constructor.validations, this.props.validations)
      }

      return this.validations
   },

   getError(value) {
      let error = null

      Object.entries(this.getValidations()).forEach(([e, rule]) => {
         switch(typeof rule) {
         case 'object':
            switch(rule.constructor.name) {
            case 'RegExp':
               if ((value || "").match(rule)) {
                  error = e
               }
            case 'Array':
               if (rule[0] === '!' && !(value || "").match(rule[1])) {
                  error = e
               }
            }
            break
         case 'function':
            if (rule(value)) {
               error = e
            }
         }
      })

      return error
   },

   updateError(value) {
      this.error = this.getError(value)

      if (this.$error) {
         this.$error.setState({error: this.error})
      }

      return this.error
   },

   isValid() {
      return !this.error
   }
}

export default Validation
