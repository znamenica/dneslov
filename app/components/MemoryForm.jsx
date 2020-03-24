import PropTypes from 'prop-types'

import SlugField from 'SlugField'
import NotesCollection from 'NotesCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import BeingsCollection from 'BeingsCollection'
import WikiesCollection from 'WikiesCollection'
import PatericsCollection from 'PatericsCollection'
import MemoryNamesCollection from 'MemoryNamesCollection'
import EventsCollection from 'EventsCollection'
import OrderField from 'OrderField'
import TextField from 'TextField'
import BaseYearField from 'BaseYearField'
import ShortNameField from 'ShortNameField'
import PlaceField from 'PlaceField'
import DynamicField from 'DynamicField'
import CommonForm from 'CommonForm'
import ErrorSpan from 'ErrorSpan'
import { matchEmptyObject } from 'matchers'

export default class MemoryForm extends CommonForm {
   static defaultProps = {
      slug: {text: ''},
      base_year: 0,
      short_name: '',
      council: '',
      quantity: '',
      bond_to_id: 0,
      bond_to: '',
      covers_to_id: 0,
      covers_to: '',
      descriptions: [],
      notes: [],
      wikies: [],
      beings: [],
      paterics: [],
      memory_names: [],
      events: [],

      remoteName: 'memory',
      remoteNames: 'memories',
   }

   static propTypes = {
      slug: PropTypes.object,
   }

   static getCleanState() {
      return {
         id: undefined,
         slug: { text: '' },
         short_name: '',
         base_year: 0,
         council: '',
         quantity: '',
         bond_to_id: undefined,
         bond_to: '',
         covers_to_id: undefined,
         covers_to: '',
         notes: [],
         descriptions: [],
         wikies: [],
         beings: [],
         paterics: [],
         memory_names: [],
         events: [],
      }
   }

   renderContent() {
      return [
         <SlugField
            key='slug'
            value={this.state.query.slug.text}
            wrapperClassName='input-field col xl2 l2 m6 s12' />,
         <ShortNameField
            key='shortName'
            value={this.state.query.short_name}
            wrapperClassName='input-field col xl3 l3 m6 s12' />,
         <BaseYearField
            key='baseYear'
            value={this.state.query.base_year.toString()}
            wrapperClassName='input-field col xl2 l3 m6 s12' />,
         <PlaceField
            key='coversTo'
            name='covers_to_id'
            humanized_name='covers_to'
            title='Покровительство'
            placeholder='Введи место покровительства'
            value={this.state.query.covers_to_id}
            humanized_value={this.state.query.covers_to}
            wrapperClassName='input-field col xl5 l4 m6 s12' />,
         <TextField
            key='council'
            name='council'
            title='Собор'
            placeholder='Введи сокращение собора'
            value={this.state.query.council}
            wrapperClassName='input-field col xl3 l3 m6 s12' />,
         <TextField
            key='quantity'
            name='quantity'
            title='Количество'
            placeholder='Введи количество'
            value={this.state.query.quantity}
            wrapperClassName='input-field col xl3 l3 m6 s12' />,
         <DynamicField
            key='bondTo'
            pathname='icons'
            key_name='short_name'
            value_name='id'
            name='bond_to_id'
            humanized_name='bond_to'
            title='Вид'
            placeholder='Введи вид образа'
            value={this.state.query.bond_to_id}
            humanized_value={this.state.query.bond_to}
            wrapperClassName='input-field col xl6 l6 m6 s12' />,
         <DescriptionsCollection
            key='descriptions'
            name='descriptions'
            value={this.state.query.descriptions} />,
         <NotesCollection
            key='notes'
            name='notes'
            value={this.state.query.notes} />,
         <BeingsCollection
            key='beings'
            name='beings'
            value={this.state.query.beings} />,
         <WikiesCollection
            key='wikies'
            name='wikies'
            value={this.state.query.wikies} />,
         <PatericsCollection
            key='paterics'
            name='paterics'
            value={this.state.query.paterics} />,
         <MemoryNamesCollection
            key='memoryNames'
            name='memory_names'
            value={this.state.query.memory_names} />,
         <EventsCollection
            key='events'
            name='events'
            value={this.state.query.events} />,
         <ErrorSpan
            error={this.getErrorText(this.state)} />]
   }
}
