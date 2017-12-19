import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import NameField from 'NameField'
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
      name: null,
      state: null,
      feasible: null,
      mode: null,
      onUpdate: null,
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      name_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      feasible: PropTypes.boolean.isRequired,
      mode: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   // system
   componentWillMount() {
      this.r = new Array
   }

   onChildUpdate(property) {
      this.props.onUpdate({[this.props._id]: property})
   }

   render() {
      console.log(this.props)

      return (
         <div className='row'>
            <NameField
               ref={e => this.r.push(e)}
               key='nameId'
               name_id={this.props.name_id}
               name_text={this.props.name}
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
               onUpdate={this.onChildUpdate.bind(this)} />
            <FeasibleBox
               ref={e => this.r.push(e)}
               key='feasibleBox'
               feasible={this.props.feasible}
               wrapperClassName='fake-input-field col xl2 l2 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
         </div>)}}
