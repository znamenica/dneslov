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

export default class MemoryForm extends CommonForm {
   static defaultProps = {
      slug: {text: ''},
      base_year: '',
      short_name: '',
      order: null,
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
   }

   static propTypes = {
      slug: PropTypes.object,
      order: PropTypes.string.isRequired,
   }

/*
   isCouncil() {
      this.state.order == 'сбр'
   }

   isIcon() {
      this.state.order == 'обр'
   }
*/
   render() {
      console.log(this.props)
      console.log(this.query)

      return (
         <div>
            <div className='row'>
               <SlugField
                  ref={e => this.r.push(e)}
                  key='slug'
                  slug={this.query.slug}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <ShortNameField
                  ref={e => this.r.push(e)}
                  key='shortName'
                  short_name={this.query.short_name}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <OrderField
                  ref={e => this.r.push(e)}
                  key='order'
                  order={this.query.order}
                  wrapperClassName='input-field col xl5 l5 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <BaseYearField
                  ref={e => this.r.push(e)}
                  key='baseYear'
                  base_year={this.query.base_year.toString()}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <PlaceField
                  ref={e => this.r.push(this.$covers_to = e)}
                  key='coversTo'
                  field_name='covers_to_id'
                  name='covers_to'
                  title='Покровительство'
                  placeholder='Введи место покровительства'
                  covers_to_id={this.query.covers_to_id}
                  covers_to={this.query.covers_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='council'
                  name='council'
                  title='Собор'
                  placeholder='Введи сокращение собора'
                  council={this.query.council}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='quantity'
                  name='quantity'
                  title='Количество'
                  placeholder='Введи количество'
                  quantity={this.query.quantity}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <DynamicField
                  ref={e => this.r.push(this.$bondTo = e)}
                  key='bondTo'
                  pathname='icons'
                  key_name='short_name'
                  value_name='id'
                  field_name='bond_to_id'
                  name='bond_to'
                  title='Вид'
                  placeholder='Введи вид образа'
                  bond_to_id={this.query.bond_to_id}
                  bond_to={this.query.bond_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     key='error' /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={e => this.r.push(e)}
                     key='descriptions'
                     name='descriptions'
                     value={this.query.descriptions}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <NotesCollection
                     ref={e => this.r.push(e)}
                     key='notes'
                     name='notes'
                     value={this.query.notes}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <BeingsCollection
                     ref={e => this.r.push(e)}
                     key='beings'
                     name='beings'
                     value={this.query.beings}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <WikiesCollection
                     ref={e => this.r.push(e)}
                     key='wikies'
                     name='wikies'
                     value={this.query.wikies}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <PatericsCollection
                     ref={e => this.r.push(e)}
                     key='paterics'
                     name='paterics'
                     value={this.query.paterics}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <MemoryNamesCollection
                     ref={e => this.r.push(e)}
                     key='memoryNames'
                     name='memory_names'
                     value={this.query.memory_names}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <EventsCollection
                     ref={e => this.r.push(e)}
                     key='events'
                     name='events'
                     value={this.query.events}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div></div>)}}
