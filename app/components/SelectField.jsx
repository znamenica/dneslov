import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'

@mixin(Validation)
export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      wrapperClassName: null,
      codeNames: null,
      validations: {},
      title: null,
      onUpdate: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      [this.props.name]: this.props[this.props.name] || '',
   }

   // system
   componentWillMount() {
      this.updateError(this.state[this.props.name])
   }

   componentDidMount() {
      $(this.$select).material_select()
      $(this.$select).on('change', this.onChange.bind(this))
      this.$wrap = this.$parent.querySelector('.select-wrapper')
   }

   componentWillUnmount() {
      $(this.$select).off('change', this.onChange.bind(this))
      $(this.$select).material_select('destroy')
   }

   componentDidUpdate() {
      if (this.error) {
         this.$wrap.classList.add('invalid')
      } else {
         this.$wrap.classList.remove('invalid')
      }
   }

   componentWillReceiveProps(nextProps) {
      if (this.state[this.props.name] != nextProps[this.props.name]) {
         let value = nextProps[this.props.name] || ''
         $(this.$select).material_select('destroy')
         this.setState({[this.props.name]: value})
         this.updateError(value)
         this.$select.value = value
         $(this.$select).material_select()
         this.$wrap = this.$parent.querySelector('.select-wrapper')
      }
   }

   // events
   onChange(e) {
      let name = this.props.name, value = e.target.value
      this.updateError(value)

      this.setState({[name]: value})
      this.props.onUpdate({[name]: value})
   }

   render() {
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
               value={this.state[this.props.name]}
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
                  key={'error'}
                  error={this.error}
                  ref={e => this.$error = e} /></label></div>)}}
