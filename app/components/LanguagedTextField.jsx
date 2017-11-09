import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import TextField from 'TextField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class LanguagedTextField extends Component {
   static defaultProps = {
      _id: null,
      key_name: null,
      language_code: '',
      alphabeth_code: '',
      title: 'Текст',
      placeholder: 'Введи текст',
      onUpdate: null,
      value_validations: {
         "Текст отсутствует": /^$/
      },
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      key_name: PropTypes.string.isRequired,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
      onUpdate: PropTypes.func.isRequired,
      value_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   properties = {
      value: this.props[this.props.key_name],
      language_code: this.props.language_code,
      alphabeth_code: this.props.alphabeth_code,
   }

   r = []

   // system
   componentWillReceiveProps(nextProps) {
      if (this.props[this.props.key_name] != nextProps[nextProps.key_name]) {
         this.setState({[this.props.key_name]: nextProps[nextProps.key_name]})
         this.updateError(nextProps[nextProps.key_name] || '')
      }
   }

   // events
   onChange(property) {
      this.properties = assign(this.properties, property)
      this.updateError(this.properties)
      this.props.onUpdate({[this.props._id]: property})
   }

   render() {
      console.log(this.props)

      return (
         <div className='row'>
            <TextField
               ref={e => this.r.push(e)}
               key={'value'}
               title={this.props.title}
               placeholder={this.props.placeholder}
               name={this.props.key_name}
               text={this.props[this.props.key_name]}
               validations={this.props.value_validations}
               wrapperClassName='input-field col xl6 l6 m12 s12'
               onUpdate={this.onChange.bind(this)} />
            <LanguageField
               ref={e => this.r.push(e)}
               key={'language_code'}
               language_code={this.props.language_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} />
            <AlphabethField
               ref={e => this.r.push(e)}
               key={'alphabeth_code'}
               alphabeth_code={this.props.alphabeth_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} />
            <div className="col">
               <ErrorSpan
                  key={'error'}
                  error={this.getError(this.properties)}
                  ref={e => this.$error = e} /></div></div>)}}
