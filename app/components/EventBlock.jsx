import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import * as uuid from 'uuid/v1'
import { mixin } from 'lodash-decorators'

import TextField from 'TextField'
import EventTypeField from 'EventTypeField'
import PlaceField from 'PlaceField'
import ItemField from 'ItemField'
import { matchCodes } from 'matchers'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class EventBlock extends Component {
   static defaultProps = {
      _id: null,
      happened_at: null,
      type: null,
      place_id: null,
      item_id: null,
      person_name: null,
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      happened_at: PropTypes.string,
      type: PropTypes.string,
      place_id: PropTypes.number,
      item_id: PropTypes.number,
      person_name: PropTypes.string,
   }

   // system
   onChildUpdate(property) {
//      this.props.onUpdate({[this.props._id]: property})
   }

   render() {
      console.log(this.props)

      return (
         <div className='row'>
            <EventTypeField
               key='type'
               name={this.props._id + '.type'}
               value={this.props.type}
               wrapperClassName='input-field col xl4 l4 m6 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <TextField
               key='happenedAt'
               name={this.props._id + '.happened_at'}
               title='Случилось в...'
               placeholder='Введи пору'
               value={this.props.happened_at}
               validations={this.props.value_validations}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <PlaceField
               key='placeId'
               name={this.props._id + '.place_id'}
               humanized_name={this.props._id + '.place'}
               title='Место происшествия'
               value={this.props.place_id}
               humanized_value={this.props.place}
               wrapperClassName='input-field col xl5 l5 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <ItemField
               key='itemId'
               name={this.props._id + '.item_id'}
               humanized_name={this.props._id + '.item'}
               value={this.props.item_id}
               humanized_value={this.props.item}
               wrapperClassName='input-field col xl6 l6 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <TextField
               key='personName'
               name={this.props._id + '.person_name'}
               title='Имя связанной личности...'
               placeholder='Введи имя'
               value={this.props.person_name}
               wrapperClassName='input-field col xl6 l6 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} /></div>)
   }
}
