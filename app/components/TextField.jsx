import { Component } from 'react'
import PropTypes from 'prop-types'

export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      postfix: null,
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
      postfix: PropTypes.string,
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

   error = this.checkError(this.props.text || '')

   fullname = [this.props.name, this.props.postfix].filter((e) => { return e }).join("_")

   componentDidMount() {
      if (this.props.data['length']) {
         $(this.$input).characterCounter()
      }
   }

   checkError(value) {
      let error = null
      Object.entries(this.props.validations).forEach(([e, rule]) => {
         if (typeof rule === 'object' && (rule instanceof RegExp) && value.match(rule)) {
            error = e
         } else if (typeof rule === 'func' && rule()) {
            error = e
         }
      })

      return error
   }

   onChange(e) {
      let name = this.props.name, value = e.target.value
      this.error = this.checkError(value)

      this.setState({[name]: value})
      this.props.onUpdate({[this.fullname]: value})
   }

   isValid() {
      return !this.error
   }

   render() {
      //console.log(this.props.name, this.state[this.props.name])
      //console.log(this.props.data)

      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               type='text'
               className={this.error && 'invalid'}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               ref={c => {this.$input = c}}
               placeholder={this.props.placeholder}
               value={this.state[this.props.name]}
               data-length={this.props.data['length']}
               onChange={this.onChange.bind(this)} />
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <div className="error">
                  {this.error}</div></label></div>)}}
