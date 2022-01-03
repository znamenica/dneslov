import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { Autocomplete } from 'materialize-css'
import * as Axios from 'axios'
import { merge } from 'merge-anything'

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
      value: "",
      humanized_value: undefined,
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
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      validations: PropTypes.object.isRequired,
   }

   data = { list: {}, total: 0 }

   // system
   constructor(props) {
      super(props)

      if (props.value) {
         this.data = { list: { [props.humanized_value]: props.value }, total: 1 }
      }
      this.onKeyDown = this.onKeyDown.bind(this)
   }

   componentDidMount() {
      console.debug("[componentDidMount] <<<")
      console.log("[componentDidMount] * ", this.data, this.props.value)
      this.setup()
      document.addEventListener('keydown', this.onKeyDown)
   }

   componentDidUpdate() {
      console.debug("[componentDidUpdate] <<<")

      if (this.$input) {
         this.setup()
         this.autoUpdate()
      }
   }

   componentWillUnmount() {
      console.debug("[componentWillUnmount] <<<")
      this.destroy()
      document.removeEventListener('keypress', this.onKeyDown)
   }

   shouldComponentUpdate(nextProps, nextState) {
      return this.props.value !== nextProps.value ||
             this.props.humanized_value !== nextProps.humanized_value
   }

   //events
   onChange(e) {
      let humanized_value = e.target.value

      console.log("[onChange] * update to", humanized_value)
      this.updateTo(humanized_value, false)

      console.debug("[onChange] ** analyzing:", this.triggered,
         humanized_value, this.data, this.data && this.data.total,
         this.data && Object.keys(this.data.list).length)

      if (!this.triggered || humanized_value &&
          (!humanized_value.includes(this.triggered) &&
           !this.triggered.includes(humanized_value) ||
           this.data && (this.data.total > Object.keys(this.data.list).length &&
            humanized_value.includes(this.triggered) ||
            this.triggered.includes(humanized_value)))) {
         this.getDataFor(humanized_value)
      }
   }

   onSelectFromList(humanized_value, e) {
      console.log("[onSelectFromList] * fix to:", humanized_value)
      this.updateTo(humanized_value)
   }

   onKeyDown(e) {
      if (e.key === "Enter" && e.target == this.$input) {
         console.log("[onKeyDown] * fix to", this.$input.value)
         e.preventDefault()
         if (this.data.list[this.$input.value]) {
            this.updateTo(this.$input.value)
         }
      }
   }

   onChipAct() {
      let object = this.valueToObject(this.props.name, null),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      console.log("[onChipAct] * unfix with", object)
      document.dispatchEvent(ce)
   }

   //actions
   setup() {
      if (this.$input) {
         this.input = Autocomplete.init(this.$input, {
            data: {},
            limit: 20,
            minLength: 1,
            onAutocomplete: this.onSelectFromList.bind(this)
         })
      }
   }

   destroy() {
      if (this.input) {
         this.input.destroy()
      }

      this.input = false
   }

   //actions
   autoUpdate() {
      console.log("[autoUpdate] *", this.input)
      let list = Object.keys(this.data.list).reduce((h, x) => { h[x] = null; return h }, {})

      console.debug("[autoUpdate] **", list)
      this.input.updateData(list)
   }

   updateTo(humanized_value_in, autofix = true) {
      console.log("[updateTo] <<<", humanized_value_in, autofix)
      let ce, detail, value_detail = {}, value, humanized_value

      if (autofix || this.data.total == 1) {
         value = this.data.list[humanized_value_in]
      }
      humanized_value = humanized_value_in

      if (value) {
         value_detail = this.valueToObject(this.props.name, value)
      }

      detail = merge({}, this.valueToObject(this.props.humanized_name, humanized_value), value_detail)
      console.debug("[updateTo] ** detail", detail)

      ce = new CustomEvent('dneslov-update-path', merge({}, { detail: detail }))
      document.dispatchEvent(ce)
   }

   getContext(contextIn) {
      let ctx = contextIn || this.props.context_value || {}

      return Object.entries(ctx).reduce((res, [name, valueIn]) => {
         if (typeof(valueIn) == "function") {
            let value = valueIn()

            if (value) {
               res[name] = value
            }
         } else {
            res[name] = valueIn
         }

         return res
      }, {})
   }

   getDataFor(text) {
      console.debug("[getDataFor] <<<")
      let data = merge(this.getContext(), { t: text })

      if (this.props.value_context) {
         Object.entries(this.getContext(this.props.value_context)).forEach(([key, value]) => {
            data["by_" + key] = value
         })
      }

      this.triggered = text

      var request = {
         data: data,
         url: '/' + this.props.pathname + '.json',
      }

      console.log("[getDataFor] * load send", data, 'to /' + this.props.pathname + '.json')
      Axios.get(request.url, { params: request.data })
        .then(this.onLoadSuccess.bind(this))
        .catch(this.onLoadFailure.bind(this))
   }

   onLoadFailure() {
      console.debug("[onLoadFailure] <<<")
      this.triggered = undefined
   }

   onLoadSuccess(response) {
      console.debug("[onLoadSuccess] <<<")

      var dynamic_data = response.data

      this.storeDynamicData(dynamic_data)

      console.log("[onLoadSuccess] *", dynamic_data, "for: ",  this.triggered, "with response:", response)

      if (this.$input) {
         console.log("[onLoadSuccess] * update autocomplete for", this.props.humanized_value)
         this.autoUpdate()
         this.input.open()
         this.updateTo(this.props.humanized_value, false)
      }
   }

   storeDynamicData(dynamic_data) {
      console.debug("[storeDynamicData] <<<", dynamic_data)
      this.data = {
         total: dynamic_data.total,
         list: dynamic_data.list.reduce((h, x) => {
            h[x[this.props.key_name]] = x[this.props.value_name]
            return h
         }, {}),
      }
      console.log("[storeDynamicData] * after store", this.data)
   }

   className() {
      return [ "input-field",
               this.props.wrapperClassName,
               this.getErrorText(this.props.value) && 'invalid' ].
         filter((x) => { return x }).join(" ")
   }

   render() {
      console.log("[render] * props", this.props)

      return (
         <div
            className={this.className()}>
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
                  className={"dynamic " + (this.getErrorText(this.props.value) && 'invalid')}
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
