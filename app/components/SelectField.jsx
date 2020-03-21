import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { FormSelect } from 'materialize-css'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'
import ValueToObject from 'mixins/ValueToObject'

@mixin(Validation)
@mixin(ValueToObject)
export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      wrapperClassName: null,
      codeNames: null,
      validations: {},
      title: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
   }

//   state = {}

   // system
//   static getDerivedStateFromProps(props, state) {
//      console.log(props, state)
//      if (state[props.name] != props[props.name]) {
//         return { [props.name]: props[props.name] }
//      } else {
//         return null;
//      }
//   }
//   static getDerivedStateFromProps(props, state) {
//      return { [props.name]: props[props.name] }
//   }

   componentDidMount() {
      // this.$select.addEventListener('change', this.onChangeA.bind(this))
      this.select = FormSelect.init(this.$select, {})
      this.$wrap = this.$parent.querySelector('.select-wrapper')
      console.log("MOUNT")
   }

   componentWillUnmount() {
      console.log("UNMOUNT")
     // console.log(this.state)
      // this.$select.removeEventListener('change', this.onChangeA.bind(this))
      this.select.destroy()
   }

//   componentDidUpdate() {
   //   console.log("state", this.state)
   // this.select.destroy()
     // this.select = FormSelect.init(this.$select, {})
     // this.$select.value = this.state[this.props.name]
     // this.$wrap = this.$parent.querySelector('.select-wrapper')
     // if (this.error) {
    //     this.$wrap.classList.add('invalid')
    //  } else {
    //     this.$wrap.classList.remove('invalid')
    //  }
   // }

   // events
   onChange(e) {
      let object = this.valueToObject(this.props.name, e.target.value),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      document.dispatchEvent(ce)
 //     this.updateError(value)

//      console.log(e.target.value, {[name]: value})
//      this.setState({[name]: value})
 //     // this.props.onUpdate({[name]: value})
   }

   render() {
      console.log(this.props)
//      console.log(typeof this.props.value)
//      console.log(this.props.value)
//      console.log(this.getErrorText(this.props.value))
//      console.log(this.state)

      return (
         <div
            ref={e => this.$parent = e}
            className={this.props.wrapperClassName}>
            <select
               ref={e => this.$select = e}
               className={this.error && 'invalid'}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               defaultValue={this.props.value || ''}
               required='required'
               onChange={this.onChange.bind(this)} >
               {Object.keys(this.props.codeNames).map((option) =>
                  <option
                     {...{[option.length == 0 && 'disabled']: 'disabled'}}
                     key={option}
                     value={option} >
                     {this.props.codeNames[option]}</option>)}</select>
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}
