import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import LanguagedTextField from 'LanguagedTextField'
import Validation from 'Validation'

@mixin(Validation)
export default class LanguagedCollection extends Component {
   static defaultProps = {
      name: null,
      postfix: null,
      value: [],
      title: null,
      action: null,
      single: null,
      placeholder: null,
      onUpdate: null,
      child_text_validations: {},
      child_validations: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      postfix: PropTypes.string,
      value: PropTypes.array.isRequired,
      title: PropTypes.title.isRequired,
      action: PropTypes.action.isRequired,
      child_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      value: this.newStateValue(this.props.value),
   }

   error = this.updateError(this.props.value)

   fullname = [this.props.name, this.props.postfix].filter((e) => { return e }).join("_")

   // system
   componentWillReceiveProps(nextProps) {
      if (this.props != nextProps) {
         this.state.value = this.newStateValue(nextProps.value)
         this.updateError(nextProps.value)
       }
   }

   // events
   onAddItem() {
      this.state.value.push({key: uuid()})
      this.updateError(this.state.value)
      this.forceUpdate()
   }

   onChildUpdate(property) {
      let error = this.updateError(this.state.value)

      if (error !== this.error) {
         this.error = error
         this.forceUpdate()
      }
      this.props.onUpdate({[this.fullname]: property})
   }

   // proprties
   newStateValue(value) {
      return value.map((element, index) => {return {key: uuid()}})
   }

   getElementWith(element, index) {
      return assign({_id: element.key, ref: element.key}, element, this.props.value[index] || {})
   }

   render() {
      console.log(this.state)
      
      return (
         <div className='row'>
            <h5>{this.props.title}</h5>
            <div id={this.props.name}>
               {this.state.value.map((element, index) =>
                  <LanguagedTextField
                     title={this.props.single}
                     placeholder={this.props.placeholder}
                     text_validations={this.props.child_text_validations}
                     validations={this.props.child_validations}
                     {...this.getElementWith(element, index)}
                     onUpdate={this.onChildUpdate.bind(this)} />)}</div>
            <div className="error">
               {this.error}</div>
            <button
               className='btn btn-primary'
               onClick={this.onAddItem.bind(this)}
               type='button'>
               <i className='small material-icons'>add_to_photos</i>
               {this.props.action}</button></div>)}}
