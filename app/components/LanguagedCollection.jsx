import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'

import LanguagedTextField from 'LanguagedTextField'

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
   }

   state = {
      value: this.props.value.map((element, index) => {return {key: uuid()}}),
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      postfix: PropTypes.string,
      value: PropTypes.array.isRequired,
      title: PropTypes.title.isRequired,
      action: PropTypes.action.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   onAddName() {
      this.state.value.push({key: uuid()})
      this.forceUpdate()
   }

   onChildUpdate(property) {
      let fullname = [name, this.props.postfix].filter((e) => { return e }).join("_")
      this.props.onUpdate({[fullname]: property})
   }

   getElementWith(element, index) {
      return assign({_id: element.key}, element, this.props.value[index] || {})
   }

   render() {
      return (
         <div className='row'>
            <h5>{this.props.title}</h5>
            <div id={this.props.name}>
               {this.state.value.map((element, index) =>
                  <LanguagedTextField
                     title={this.props.single}
                     placeholder={this.props.placeholder}
                     {...this.getElementWith(element, index)}
                     onUpdate={this.onChildUpdate.bind(this)} />)}</div>
            <button
               className='btn btn-primary'
               onClick={this.onAddName.bind(this)}
               type='button'>
               <i className='small material-icons'>add_to_photos</i>
               {this.props.action}</button></div>)}}
