import { Component } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'merge-anything'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'
import { renderElement } from 'render'
import ErrorSpan from 'ErrorSpan'
import { propsAsArray, valueToObject } from 'support'

@mixin(Validation)
export default class Collection extends Component {

   static defaultProps = {
      name: null,
      value: {},
      title: null,
      action: null,
      meta: {},
      wrapperClassName: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      meta: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      validation_context: PropTypes.object.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            prevProps: props,
            value: propsAsArray(props)
         }
      }

      return null
   }

   // system
   state = {}

   // events
   onAddItem() {
      let key = uuid(),
          detail = { [this.props.name]: { [key]: { _id: key, _pos: this.state.value.length } } },
          e = new CustomEvent('dneslov-update-path', { detail: detail })

      document.dispatchEvent(e)
   }

   onToggleItem(element) {
      console.debug("[onToggleItem] >>>>", element, this.props.value)
      let new_state = !element.value._destroy,
          object = valueToObject( element.name, { _destroy: new_state }),
          e = new CustomEvent('dneslov-update-path', { detail: object })

      console.debug("[onToggleItem]", object)

      document.dispatchEvent(e)
   }

   // service
   blankClass(element) {
      return element.value._destroy && " blank" || ""
   }

   renderBlock(element) {
      return (
         <div className={'block' + this.blankClass(element)}>
            {element.value._destroy &&
               <a
                  onClick={() => { this.onToggleItem(element) }}
                  className="block-item btn-floating btn-small waves-effect waves-light terracota">
                  <i className="small material-icons">settings_backup_restore</i></a> ||
               <a
                  onClick={() => { this.onToggleItem(element) }}
                  className="block-item btn-floating btn-small waves-effect waves-light terracota">
                  <i className="small material-icons">delete</i></a>}
            <div className='row'>
               {!element.value._destroy && renderElement(element, this.props.meta)}</div></div>)
   }

   render() {
      console.log("[render] > state:", this.state, "from props:", this.props)

      return (
         <div className={this.props.wrapperClassName}>
            <div className='row'>
               <h5>{this.props.title}</h5>
               <div id={this.props.name}>
                  {this.state.value.map(block =>
                     { return this.renderBlock(block) })}</div>
               <div className='row'>
                  <div className='col'>
                     <ErrorSpan
                        error={this.getErrorText(this.state.value)} /></div></div>
               <button
                  className='btn btn-primary'
                  onClick={this.onAddItem.bind(this)}
                  type='button'>
                  <i className='small material-icons'>add_to_photos</i>
                  {this.props.action}</button></div></div>)
   }
}
