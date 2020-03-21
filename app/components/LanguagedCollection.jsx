import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import LanguagedTextField from 'LanguagedTextField'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class LanguagedCollection extends Component {
   static defaultProps = {
      name: null,
      key_name: null,
      value: {},
      title: null,
      action: null,
      single: null,
      textField: false,
      placeholder: null,
      child_value_validations: {},
      child_validations: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      key_name: PropTypes.string.isRequired,
      value: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      child_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
   }

   // events
   onAddItem() {
      let key = uuid()
      let detail = { [this.props.name]: { [key]: { _id: key } } }
      let e = new CustomEvent('dneslov-update-path', { detail: detail })
      console.log("ADD", detail)
      document.dispatchEvent(e)
   }

   // proprties
   asArray() {
      return Object.entries(this.props.value).map(([key, element]) =>
         assign({
            name: this.props.name + '.' + key,
            value: element,
            key: key,
         })
      )
   }

   render() {
      console.log(this.asArray(), this.props.value)

      return (
         <div className='col xl12 l12 m12 s12'>
            <div className='row'>
               <h5>{this.props.title}</h5>
               <div id={this.props.name}>
                  {this.asArray().map(element =>
                     <LanguagedTextField
                        title={this.props.single}
                        placeholder={this.props.placeholder}
                        value_validations={this.props.child_value_validations}
                        validations={this.props.child_validations}
                        key_name={this.props.key_name}
                        textField={this.props.textField}
                        {...element} />)}</div>
               <div className='row'>
                  <div className='col'>
                     <ErrorSpan
                        error={this.getErrorText(this.props.value)} /></div></div>
               <button
                  className='btn btn-primary'
                  onClick={this.onAddItem.bind(this)}
                  type='button'>
                  <i className='small material-icons'>add_to_photos</i>
                  {this.props.action}</button></div></div>)
   }
}
