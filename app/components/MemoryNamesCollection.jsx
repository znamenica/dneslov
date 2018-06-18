import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import MemoryNameBlock from 'MemoryNameBlock'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class MemoryNamesCollection extends Component {
   static defaultProps = {
      name: null,
      key_name: null,
      value: {},
      title: null,
      action: null,
      single: null,
      placeholder: null,
      onUpdate: null,
      child_value_validations: {},
      child_validations: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      key_name: PropTypes.string,
      value: PropTypes.object.isRequired,
      title: PropTypes.string,
      action: PropTypes.string,
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

   componentWillUpdate() {
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
            <h5>Имена</h5>
            <div id={this.props.name}>
               {this.asArray().map((element) =>
                  <MemoryNameBlock
                     ref={e => this.r.push(e)}
                     {...element}
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
               Добавь имя</button></div>)}}
