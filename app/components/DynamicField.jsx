import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import Chip from 'Chip'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class DynamicField extends Component {
   static defaultProps = {
      pathname: null,
      key_name: null,
      value_name: null,
      name: 'text',
      subname: null,
      text: '',
      wrapperClassName: null,
      title: null,
      placeholder: null,
      validations: {},
      onUpdate: null,
      allowChange: null,
   }

   static propTypes = {
      pathname: PropTypes.string.isRequired,
      key_name: PropTypes.string.isRequired,
      value_name: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = {
      [this.props.name]: this.props[this.props.name] || '',
      fixed: false,
   }

   data = {
      list: {}, //hash, key: name, value: id
      total: 0,
   }

   // system
   componentWillReceiveProps(nextProps) {
      console.log(nextProps, this.props)
      if (this.value() != nextProps[nextProps.name]) {
         this.setState({[this.props.name]: nextProps[nextProps.name] || ''})
         this.updateError(nextProps[nextProps.name] || '')
      }
   }

   componentWillMount() {
      this.updateError(this.state[this.props.name])
   }

   componentWillUpdate(nextProps, nextState) {
      let value, real

      console.log(this.props)
      if (this.props.name.match(/_id$/)) {
         value = this.data[nextState[nextProps.name]]
      } else {
         value = nextState[nextProps.name]
      }

      this.updateError(value)

      if (nextProps.subname) {
         real = {[nextProps.subname]: value} // TODO add text as variable subkey
      } else {
         real = value
      }
      this.props.onUpdate({[nextProps.name]: real})
   }

   //events
   onChange(e) {
      let value = e.target.value
      this.setState({[this.props.name]: value})
      this.triggerListBy(value)
   }

   onKeyPress(e) {
      if (e.key === "Enter") {
         e.preventDefault()
         this.setState({fixed: true})
      }
   }

   onChipAct() {
      this.setState({fixed: false})
   }

   //checkers
   hasValue() {
      // has fixed value which is presented on the server side
      return this.state.fixed && !!this.state[this.props.name]
   }

   setAutocomplete() {
      let list = Object.keys(this.data.list).reduce((h, x) => { h[x] = null; return h }, {})
      
      console.log("data", this.data.list)
      $(this.$input).autocomplete({
         data: list,
         limit: 20,
         minLength: 1,
      })

      this.$input.dispatchEvent(new KeyboardEvent('keydown',{'key':'Shift'})); //triggers popup
      this.$input.dispatchEvent(new KeyboardEvent('keyup',{'key':'Shift'})); //triggers popup
   }

   valueText() {
      if (this.value() == this.props[this.props.name]) {
         return this.props.text
      } else {
         return this.data.list[this.value()]
      }
   }

   value() {
      return this.state[this.props.name] || ''
   }

   triggerListBy(text) {
      if (!this.triggered) {
         this.triggered = text
         $.ajax({
            method: 'GET',
            dataType: 'JSON',
            data: { with_token: text },
            url: '/' + this.props.pathname + '.json',
            success: this.onSuccessLoad.bind(this),
            error: this.onErrorRequest.bind(this),
         })
      }
   }

   onErrorRequest() {
      this.triggered = undefined
   }

   onSuccessLoadText(dynamic_data) {
      this.storeDynamicData(dynamic_data)

      this.forceUpdate()
   }

   onSuccessLoad(dynamic_data) {
      this.storeDynamicData(dynamic_data)

      console.log("SUCCESS", dynamic_data)

      //popup autocomplete
      this.setAutocomplete()

      if (this.triggered) {
         if (this.value().length > this.triggered.length &&
             dynamic_data.total > dynamic_data.list.length ||
             this.value().length < this.triggered.length &&
             this.value().length > 0) {
            this.triggerListBy(this.value())
         }
         this.triggered = undefined
      }
   }

   storeDynamicData(dynamic_data) {
      this.data.total = dynamic_data.total
      this.data.list = dynamic_data.list.reduce((h, x) => {
         h[x[this.props.key_name]] = x[this.props.value_name]
         return h
      }, {})
   }

   render() {
      return (
         <div
            className={this.props.wrapperClassName}>
            {!this.hasValue() &&
               <input
                  type='text'
                  className={this.error && 'invalid'}
                  ref={e => this.$input = e}
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.valueText()}
                  onChange={this.onChange.bind(this)} />}
            {this.hasValue() &&
               <Chip
                  key={this.props.name}
                  color='eee'
                  text={this.valueText()}
                  onAct={this.onChipAct.bind(this)} />}
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <ErrorSpan
                  key={'error'}
                  error={this.error}
                  ref={e => this.$error = e} /></label></div>)}}
