import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { CharacterCounter } from 'materialize-css'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'
import ValueToObject from 'mixins/ValueToObject'

@mixin(Validation)
@mixin(ValueToObject)
export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      value: null,
      subname: null,
      wrapperClassName: null,
      title: null,
      placeholder: null,
      textArea: false,
      data: {},
      validations: {},
      allowChange: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
 //     path: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object,
      validations: PropTypes.object.isRequired,
      allowChange: PropTypes.func,
   }

//   state = {}

//   static getDerivedStateFromProps(props, state) {
//      state = [props.name]: props[props.name],
//      return {
//         [props.name]: props[props.name],
//         error: getErrorText()
//      }
//   }

   // system
   componentDidMount() {
      if (this.props.data && this.props.data['length']) {
         CharacterCounter.init(this.$input)
      }
   }

   componentDidUpdate() {
//      let real = this.props.value

//      if (this.props.subname) {
//         real = {[this.props.subname]: real} // TODO add text as variable subkey
//      }
      console.log('up', this.props )
//      this.props.onUpdate({[this.props.path]: real})

      if (this.props.textArea) {
         M.textareaAutoResize(this.$input)
      }
   }

   // events
   onChange(e) {
      console.log("Change")
      let object = this.valueToObject(this.props.name, e.target.value),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      document.dispatchEvent(ce)
 //     this.updateError(value)

      console.log(e.target.value, object)
 //     this.setState({[name]: value})
   }

   // support
 //  value(state = this.state) {
 //     return state[this.props.name]
 //  }

   render() {
      console.log(this.props, this.props.value)
     
      return (
         <div
            className={this.props.wrapperClassName}>
            {this.props.textArea &&
               <textarea
                  type='text'
                  className={'materialize-textarea ' + (this.error && 'invalid' || '')}
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  ref={c => {this.$input = c}}
                  placeholder={this.props.placeholder}
                  value={this.props.value || ''}
                  data-length={this.props.data && this.props.data['length']}
                  onChange={this.onChange.bind(this)} />}
            {!this.props.textArea &&
               <input
                  type='text'
                  className={this.error && 'invalid'}
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  ref={c => {this.$input = c}}
                  placeholder={this.props.placeholder}
                  value={this.props.value || ''}
                  data-length={this.props.data && this.props.data['length']}
                  onChange={this.onChange.bind(this)} />}
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}
