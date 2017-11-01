import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'

@mixin(Validation)
export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      value: null,
      wrapperClassName: null,
      codeNames: null,
      validations: {},
      title: null,
      onUpdate: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      [this.props.name]: this.props.text || '',
   }

   error = this.updateError(this.props.text || '')

   componentDidMount() {
      $(this.$select).material_select()
      $(this.$select).on('change', this.onChange.bind(this))
      this.$wrap = this.$parent.querySelector('.select-wrapper')
   }

   componentDidUpdate() {
      if (this.error) {
         this.$wrap.classList.add('invalid')
      } else {
         this.$wrap.classList.remove('invalid')
      }
   }

   componentWillUnmount() {
      $(this.$select).off('change', this.onChange.bind(this))
      $(this.$select).material_select('destroy')
   }

   componentWillReceiveProps(nextProps) {
      this.setState({[this.props.name]: nextProps.value})
   }

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
               required='required'>
               {Object.keys(this.props.codeNames).map((option) =>
                  <option
                     {...{[option.length == 0 && 'disabled']: 'disabled'}}
                     key={option}
                     value={option} >
                     {this.props.codeNames[option]}</option>)}</select>
            <label
               htmlFor={this.props.name}>
               {this.props.title}
               <div className="error">
                  {this.error}</div></label></div>)}}
