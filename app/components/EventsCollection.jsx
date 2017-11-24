import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import EventBlock from 'EventBlock'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class EventsCollection extends Component {
   static defaultProps = {
      name: null,
      value: {},
      title: null,
      action: null,
      onUpdate: null,
      child_value_validations: {},
      child_validations: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.object.isRequired,
      title: PropTypes.title.isRequired,
      action: PropTypes.action.isRequired,
      child_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      value: this.props.value
   }

   // system
   componentWillMount() {
      this.r = new Array
      this.updateError(this.state.value)
   }

   componentWillReceiveProps(nextProps) {
      console.log(this.props.value != nextProps.value, this.props.value, nextProps.value)
      if (this.props.value != nextProps.value) {
         this.state.value = nextProps.value
         this.updateError(nextProps.value)
      }
   }

   // events
   onAddItem() {
      this.state.value[uuid()] = {}
      this.updateError(this.state.value)
      this.forceUpdate()
   }

   onChildUpdate(property) {
      this.updateError(this.state.value)
      this.props.onUpdate({[this.props.name]: property})
   }

   // proprties
   getElementWith(key, element) {
      return assign({_id: key, key: key}, element, this.props.value[key] || {})
   }

   asArray() {
      let a = []
      Object.entries(this.state.value).forEach(([key, element]) => {
         a.push(this.getElementWith(key, element))
      })

      return a
   }


   render() {
      console.log(this.state,this.asArray())

      return (
         <div className='row'>
            <h5>События</h5>
            <div id={this.props.name}>
               {this.asArray().map((element) =>
                  <EventBlock
                     ref={e => this.r.push(e)}
                     {...element}
                     wrapperClassName='input-field col xl3 l3 m4 s12'
                     onUpdate={this.onChildUpdate.bind(this)} />)}</div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     error={this.error}
                     key={'error'}
                     ref={e => this.$error = e} /></div></div>
            <button
               className='btn btn-primary'
               onClick={this.onAddItem.bind(this)}
               type='button'>
               <i className='small material-icons'>add_to_photos</i>
               Добавь событие</button></div>)}}
