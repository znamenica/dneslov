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
      onUpdate: null,
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      happened_at: PropTypes.string,
      type: PropTypes.string.isRequired,
      place_id: PropTypes.number.isRequired,
      item_id: PropTypes.number.isRequired,
      person_name: PropTypes.string.isRequired,
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
            <EventTypeField
               ref={e => this.r.push(e)}
               key='type'
               name='type'
               type={this.props.type}
               wrapperClassName='input-field col xl4 l4 m6 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <TextField
               ref={e => this.r.push(e)}
               key='happenedAt'
               name='happened_at'
               title='Случилось в...'
               placeholder='Введи пору'
               name='happened_at'
               happened_at={this.props.happened_at}
               validations={this.props.value_validations}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <PlaceField
               ref={e => this.r.push(e)}
               key='placeId'
               title='Место происшествия'
               place_id={this.props.place_id}
               place={this.props.place}
               wrapperClassName='input-field col xl5 l5 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <ItemField
               ref={e => this.r.push(e)}
               key='itemId'
               item_id={this.props.item_id}
               item={this.props.item}
               wrapperClassName='input-field col xl6 l6 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} />
            <TextField
               ref={e => this.r.push(e)}
               key='personName'
               name='person_name'
               title='Имя связанной личности...'
               placeholder='Введи имя'
               person_name={this.props.person_name}
               wrapperClassName='input-field col xl6 l6 m4 s12'
               onUpdate={this.onChildUpdate.bind(this)} /></div>)}}
