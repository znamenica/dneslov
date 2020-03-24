import { Component } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'merge-anything'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import OrderField from 'OrderField'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

@mixin(Validation)
export default class OrdersCollection extends Component {
   static defaultProps = {
      name: 'orders',
      title: 'Чины',
      action: 'Добавь чин',
      validations: {
         "Языки в чинах не могут совпадать": matchLanguages,
         "Азбуки в чинах не могут совпадать": matchAlphabeths,
      },
      child_value_validations: {
         "Чин отсутствует": /^$/
      },
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.object.isRequired,
      title: PropTypes.string,
      action: PropTypes.string,
      child_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
   }

   // event
   onAddItem() {
      let key = uuid()
      let detail = { [this.props.name]: { [key]: { _id: key } } }
      let e = new CustomEvent('dneslov-update-path', { detail: detail })
      document.dispatchEvent(e)
   }

   // proprties
   asArray() {
      return Object.entries(this.props.value).map(([key, element]) =>
         merge({}, element, {
            key: key,
            _id: this.props.name + '.' + key,
            humanized_value: element.order,
            value: element.order_id,
         })
      )
   }

   render() {
      console.log("[render] >", this.asArray(), "props:", this.props)

      return (
         <div className='col xl12 l12 m12 s12'>
            <div className='row'>
               <h5>{this.props.title}</h5>
               <div id={this.props.name} className='row'>
                  {this.asArray().map(element =>
                     <OrderField
                        validations={this.props.child_value_validations}
                        name={element._id + '.order_id'}
                        humanized_name={element._id + '.order'}
                        wrapperClassName='input-field col xl12 l12 m12 s12'
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
