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
      field_name: 'text_id',
      name: 'text',
      subname: null,
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
      field_name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = this.getDefaultState()

   data = {
      list: {}, //hash, key: name, value: id
      total: 0,
   }

   getDefaultState(props = this.props) {
      console.log(props)

      let value = props[props.name] || '',
          field_value = props[props.field_name] || '',
          fixed = value && field_value

      return {[props.name]: value,
              [props.field_name]: field_value,
              fixed: fixed}
   }

   // system
   componentWillReceiveProps(nextProps) {
      console.log(nextProps, this.props)
      if (this.value() != nextProps[nextProps.name]) {
         this.setState(this.getDefaultState(nextProps))
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
   }

   componentDidMount() {
      window.addEventListener('keypress', this.onKeyPress.bind(this))
   }

   componentWillUnmount() {
      window.removeEventListener('keypress', this.onKeyPress)
   }

   //events
   onChange(e) {
      let value = e.target.value,
          state = {[this.props.name]: value, fixed: false}

      if (value == '') {
         state[this.props.field_name] = ''
         this.setStateWithUpdate(state)
      } else {
         this.setState(state)
      }

      console.log("UPDATE to", this.props.name, 'with', value)

      this.setStateWithUpdate(state)
      this.triggerListBy(value)
   }

   onSelectFromList(value) {
      console.log("FIX1")
      this.fixValue(value)
   }

   onKeyPress(e) {
      if (e.key === "Enter" && e.target == this.$input) {
         console.log("FIX2")
         e.preventDefault()
         if (this.data.list[this.$input.value]) {
            this.fixValue(this.$input.value)
         }
      }
   }

   onChipAct() {
      console.log("UNFIX")
      this.setState({fixed: false})
   }

   //checkers
   hasValue() {
      // has fixed value which is presented on the server side
      return this.state.fixed && !!this.state[this.props.field_name]
   }

   //actions
   setAutocomplete() {
      let list = Object.keys(this.data.list).reduce((h, x) => { h[x] = null; return h }, {})
      
      console.log("data", this.data.list, list)
      $(this.$input).autocomplete({
         data: list,
         limit: 20,
         minLength: 1,
         onAutocomplete: this.onSelectFromList.bind(this)
      })

      //triggering popup
      console.log("TRIGGER")
      this.$input.dispatchEvent(new KeyboardEvent('keydown',{'key':'Shift'}))
      this.$input.dispatchEvent(new KeyboardEvent('keyup',{'key':'Shift'}))
   }

   value() {
      return this.state[this.props.name]
   }

   fixValue(value) {
      this.setStateWithUpdate({[this.props.name]: value,
                               [this.props.field_name]: this.data.list[value],
                               fixed: true}, value)
   }

   setStateWithUpdate(state, value = '') {
      let real, real_text

      this.setState(state)

      if (this.props.subname) {
         // TODO add text as variable subkey
         real = {[this.props.subname]: this.data.list[value] || ''}
         real_text = {[this.props.subname]: value}
      } else {
         real = this.data.list[value] || ''
         real_text = value
      }

      this.props.onUpdate({
         [this.props.field_name]: real,
         [this.props.name]: real_text,
      })
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

   onSuccessLoad(dynamic_data) {
      this.storeDynamicData(dynamic_data)

      console.log("SUCCESS", dynamic_data)

      //popup autocomplete
      if (this.$input) {
         this.setAutocomplete()
      }

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
      console.log("props: DynamicField", this.props)
      console.log("state: DynamicField", this.state)
      
      return (
         <div
            className={this.props.wrapperClassName}>
            {!this.hasValue() &&
               <input
                  type='text'
                  className={this.error && 'invalid'}
                  ref={e => this.$input = e}
                  key={'input-' + this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.value()}
                  onChange={this.onChange.bind(this)} />}
            {this.hasValue() &&
               <Chip
                  key={'chip-' + this.props.name}
                  color='eee'
                  text={this.value()}
                  action='remove'
                  onAct={this.onChipAct.bind(this)} />}
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <ErrorSpan
                  key='error'
                  error={this.error}
                  ref={e => this.$error = e} /></label></div>)}}
