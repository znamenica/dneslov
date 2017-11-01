import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import TextField from 'TextField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class LanguagedTextField extends Component {
   static defaultProps = {
      _id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      title: 'Текст',
      placeholder: 'Введи текст',
      onUpdate: null,
      text_validations: {
         "Текст отсутствует": /^$/
      },
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      text: PropTypes.string,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
      onUpdate: PropTypes.func.isRequired,
      text_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   properties = {
      text: this.props.text,
      language_code: this.props.language_code,
      alphabeth_code: this.props.alphabeth_code,
   }

   onChange(property) {
      this.properties = assign(this.properties, property)
      this.updateError(this.properties)
      this.props.onUpdate({[this.props._id]: property})
      this.forceUpdate()
   }

   render() {
      return (
         <div className='row'>
            <TextField
               ref={'text'}
               key={'text'}
               title={this.props.title}
               placeholder={this.props.placeholder}
               text={this.props.text}
               validations={this.props.text_validations}
               wrapperClassName='input-field col xl6 l6 m12 s12'
               onUpdate={this.onChange.bind(this)} />
            <LanguageField
               ref={'language_code'}
               key={'language_code'}
               language_code={this.props.language_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} />
            <AlphabethField
               ref={'alphabeth_code'}
               key={'alphabeth_code'}
               alphabeth_code={this.props.alphabeth_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} />
            <div className="col error">
               {this.error}</div></div>)}}
