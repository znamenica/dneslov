import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { Autocomplete } from 'materialize-css'
import * as Axios from 'axios'
import * as assign from 'assign-deep'

import ErrorSpan from 'ErrorSpan'
import Chip from 'Chip'
import Validation from 'Validation'
import ValueToObject from 'mixins/ValueToObject'

@mixin(Validation)
@mixin(ValueToObject)
export default class DynamicField extends Component {
   static defaultProps = {
      pathname: null,
      key_name: null,
      value_name: null,
      name: 'text_id',
      humanized_name: 'text',
      subname: null,
      value: undefined,
      humanized_value: undefined,
      filter: null,
      filter_key: null,
      filter_value: null,
      wrapperClassName: null,
      title: null,
      placeholder: null,
      validations: {},
   }

   static propTypes = {
      pathname: PropTypes.string.isRequired,
      key_name: PropTypes.string.isRequired,
      value_name: PropTypes.string.isRequired,
      humanized_name: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      filter: PropTypes.object,
      filter_key: PropTypes.string,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      validations: PropTypes.object.isRequired,
   }

   data = {
      list: {}, //hash, key: name, value: id
      total: 0,
   }

//   // system
//   static getDerivedStateFromProps(props, state) {
//      console.log ("getD")
//      let value = props.value || undefined,
//          humanized_value = props.humanized_value || undefined,
//          fixed = humanized_value && value
//
//      return assign(state, {
//                  value: value,
//                  humanized_value: humanized_value,
//                  fixed: fixed
//               }, state)
//   }
//
 //  getSnapshotBeforeUpdate(prevProps, prevState) {
//      let value

//      console.log(props, state)
//      if (props.name.match(/_id$/)) {
//         value = state['data'][state[props.name]]
//      } else {
//         value = state[props.name]
//      }

//      this.updateError(value)
//      this.updateError(prevState[prevProps.name])
//   }

   componentDidMount() {
      this.setup()
      window.addEventListener('keypress', this.onKeyPress.bind(this))
   }

   componentDidUpdate() {
      //popup autocomplete
      if (this.$input) {
         this.setup()
         this.setAutocomplete()
      }
   }

   componentWillUnmount() {
      this.destroy()
      window.removeEventListener('keypress', this.onKeyPress)
   }

   //events
   onChange(e) {
      let humanized_value = e.target.value

      //console.log("UPDATE ", this.props.humanized_name, 'with', humanized_value, e, e.nativeEvent)

      this.updateTo(humanized_value, false)
      // this.triggerListBy(humanized_value)
      //console.log("UPDATE1111 ", this.triggered, humanized_value, this.data.total, this.data.list)
      if (!this.triggered || humanized_value &&
          (!humanized_value.includes(this.triggered) &&
           !this.triggered.includes(humanized_value) ||
           this.data && (this.data.total > this.data.list.length &&
            humanized_value.includes(this.triggered) ||
            this.triggered.includes(humanized_value)))) {
         //       if (this.props.humanized_value.length > this.triggered.length &&
//          dynamic_data.total > dynamic_data.list.length ||
//          this.props.humanized_value.length < this.triggered.length &&
//          this.props.humanized_value.length > 0) {
         this.getDataFor(humanized_value)
         //   this.setAutocomplete()
      }
   }

   onSelectFromList(humanized_value, e) {
      this.updateTo(humanized_value)
   }

   onKeyPress(e) {
      if (e.key === "Enter" && e.target == this.$input) {
         console.log("FIX")
         e.preventDefault()
         if (this.data.list[this.$input.value]) {
            this.updateTo(this.$input.value)
         }
      }
   }

   onChipAct() {
      console.log("UNFIX")
      let ce = new CustomEvent('dneslov-update-path', {
         detail: {
            [this.props.name]: null,
            [this.props.humanized_name]: this.props.humanized_value
         } })

      document.dispatchEvent(ce)
   }

   //actions
   setup() {
      if (this.$input) {
         //var aaa = M.Autocomplete.init(this.$input, {
         this.input = Autocomplete.init(this.$input, {
            data: {},
            limit: 20,
            minLength: 1,
            onAutocomplete: this.onSelectFromList.bind(this)
         })
      }

 //     this.input = Autocomplete.init(this.$input, {
 //        data: {},
 //        limit: 20,
 //        minLength: 1,
 //        onAutocomplete: this.onSelectFromList.bind(this)
 //     })
      console.log("----------", this.$input)
   }

   destroy() {
      if (this.input) {
         this.input.destroy()
      }

      console.log("----------", this.input)
      this.input = false
   }

   //checkers
 //  hasValue() {
      // has fixed value which is presented on the server side
      //return this.state.fixed && !!this.state.value
 //     return this.props.value
 //  }

   //actions
   setAutocomplete() {
      console.log("=======---", this.input)
      let list = Object.keys(this.data.list).reduce((h, x) => { h[x] = null; return h }, {})

      this.input.updateData(list)
      this.input.open()
   }

   updateTo(humanized_value_in, autofix = true) {
      let ce, detail, value_detail, value, humanized_value

      //this.setState(state)

      if (this.props.subname) {
         // TODO add text as variable subkey
         value = {subvalue: this.data.list[humanized_value_in]}
         humanized_value = {subvalue: humanized_value_in}
      } else {
         if (autofix || this.data.total == 1) {
            value = this.data.list[humanized_value_in]
         }
         humanized_value = humanized_value_in
      }

      if (value) {
         value_detail = this.valueToObject(this.props.name, value)
      }

      detail = assign({}, this.valueToObject(this.props.humanized_name, humanized_value), value_detail)

      console.log("[updateTo]", humanized_value_in, this.data.list[humanized_value_in], detail)
      ce = new CustomEvent('dneslov-update-path', { detail: detail })
      document.dispatchEvent(ce)
   }

   getDataFor(text) {
      let data = { with_token: text }

      if (this.props.filter) {
         Object.keys(this.props.filter).forEach((key) => {
            console.log(data, this.props.filter)
            if (this.props.filter[key]) {
               data[key] = this.props.filter[key]
            }
         })
      }

      if (this.props.filter_key) {
         if (this.props.filter_key && this.props.filter_value) {
            data[this.props.filter_key] = this.props.filter_value
         }
      }

      this.triggered = text

      var request = {
         data: data,
         url: '/' + this.props.pathname + '.json',
      }

      console.log("[DynamicField]: load send" ,data, 'to /' + this.props.pathname + '.json')
      Axios.get(request.url, { params: request.data })
        .then(this.onLoadSuccess.bind(this))
        .catch(this.onLoadFailure.bind(this))
   }

   onLoadFailure() {
      console.log("[DynamicField]: failure load")
      this.triggered = undefined
   }

   onLoadSuccess(response) {
      var dynamic_data = response.data

      this.storeDynamicData(dynamic_data)

      console.log("[DynamicField]: success load", dynamic_data, "for: ",  this.triggered, "having: ", this.props.humanized_value, "and resp:", response)

      if (this.$input) {
         console.log("1 qweqwqwq")
         this.setAutocomplete()
         this.updateTo(this.props.humanized_value, false)
      }
   }

   storeDynamicData(dynamic_data) {
      this.data = {
         total: dynamic_data.total,
         list: dynamic_data.list.reduce((h, x) => {
            h[x[this.props.key_name]] = x[this.props.value_name]
            return h
         }, {}),
      }
   }

   render() {
      console.log("[DynamicField]: props", this.props)

      return (
         <div
            className={this.props.wrapperClassName}>
            {!!this.props.value &&
               <div
                  className="chip">
                  <span>
                     {this.props.humanized_value}</span>
                  <i
                     className='material-icons unfix'
                     onClick={this.onChipAct.bind(this)}>
                     close</i>
               </div>}
            {!this.props.value &&
               <input
                  type='text'
                  className={this.error && 'invalid'}
                  ref={e => this.$input = e}
                  key={'input-' + this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.props.humanized_value || ''}
                  onChange={this.onChange.bind(this)} />}
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}
