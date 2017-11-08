import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      subname: null,
      text: '',
      wrapperClassName: null,
      title: null,
      placeholder: null,
      data: {},
      validations: {},
      onUpdate: null,
      allowChange: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = {
      [this.props.name]: this.props.text || '',
   }

   // system
   componentWillReceiveProps(nextProps) {
      if (this.state[this.props.name] != nextProps.text) {
         this.setState({[this.props.name]: nextProps.text || ''})
         this.updateError(nextProps.text || '')
      }
   }

   componentDidMount() {
      if (this.props.data['length']) {
         $(this.$input).characterCounter()
      }
   }

   onChange(e) {
      let name = this.props.name, value = e.target.value, real = value
      this.updateError(value)

      this.setState({[name]: value})
      if (this.props.subname) {
         real = {[this.props.subname]: value} // TODO add text as variable subkey
      }
      this.props.onUpdate({[name]: real})
   }

   render() {
      console.log(this.props.name, this.state)
      let error = this.getError(this.state[this.props.name])

      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               type='text'
               className={error && 'invalid'}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               ref={c => {this.$input = c}}
               placeholder={this.props.placeholder}
               value={this.state[this.props.name] || ''}
               data-length={this.props.data['length']}
               onChange={this.onChange.bind(this)} />
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <ErrorSpan
                  key={'error'}
                  error={error}
                  ref={e => this.$error = e} /></label></div>)}}
