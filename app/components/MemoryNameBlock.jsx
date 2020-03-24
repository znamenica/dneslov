import { Component } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'merge-anything'
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
   }

   static propTypes = {
      _id: PropTypes.string,
      name_id: PropTypes.number,
      name: PropTypes.string,
      state: PropTypes.string,
      feasible: PropTypes.bool,
      mode: PropTypes.string,
   }

   // system
   render() {
      console.log(this.props)

      return (
         <div className='row'>
            <NameField
               key='nameId'
               name={this.props._id + '.name_id'}
               humanized_name={this.props._id + '.name'}
               value={this.props.name_id}
               humanized_value={this.props.name}
               wrapperClassName='input-field col xl3 l3 m4 s12' />
            <NameStateField
               key='state'
               name={this.props._id + '.state'}
               value={this.props.state}
               wrapperClassName='input-field col xl3 l3 m4 s12' />
            <NameModeField
               key='mode'
               name={this.props._id + '.mode'}
               value={this.props.mode}
               wrapperClassName='input-field col xl3 l3 m4 s12' />
            <FeasibleBox
               key='feasibleBox'
               name={this.props._id + '.feasible_box'}
               value={this.props.feasible}
               wrapperClassName='fake-input-field col xl2 l2 m4 s12' />
         </div>)
   }
}
