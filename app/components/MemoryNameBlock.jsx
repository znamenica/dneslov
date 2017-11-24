import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import MemoryNameField from 'MemoryNameField'
import NameStateField from 'NameStateField'
import FeasibleBox from 'FeasibleBox'
import NameModeField from 'NameModeField'
import { matchCodes } from 'matchers'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class MemoryNameBlock extends Component {
   static defaultProps = {
      _id: null,
      name_id: null,
      state: null,
      feasibly: null,
      mode: null,
      onUpdate: null,
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      name_id: PropTypes.number.isRequired,
      state: PropTypes.string.isRequired,
      feasibly: PropTypes.boolean.isRequired,
      mode: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   // system
   componentWillMount() {
      this.r = new Array
   }

   onChildUpdate(property) {
      this.props.onUpdate({[this.props.name]: property})
   }

   render() {
      console.log(this.props)

      return (
         <div className='row'>
            <FeasibleBox
               ref={e => this.r.push(e)}
               key='feasibly'
               name='feasibly'
               feasibly={this.props.feasibly}
               wrapperClassName='input-field col xl3 l3 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <MemoryNameField
               ref={e => this.r.push(e)}
               key='name_id'
               name_id={this.props.name_id}
               wrapperClassName='input-field col xl3 l3 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <NameStateField
               ref={e => this.r.push(e)}
               key='state'
               name='state'
               state={this.props.state}
               wrapperClassName='input-field col xl3 l3 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <NameModeField
               ref={e => this.r.push(e)}
               key='mode'
               name='mode'
               mode={this.props.mode}
               wrapperClassName='input-field col xl3 l3 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} /></div>)}}
