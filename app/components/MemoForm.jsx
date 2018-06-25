import PropTypes from 'prop-types'

import DynamicField from 'DynamicField'
import TitlesCollection from 'TitlesCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import LinksCollection from 'LinksCollection'
import MemoBindKindField from 'MemoBindKindField'
import DateField from 'DateField'
import YearDateField from 'YearDateField'
import CalendaryField from 'CalendaryField'
import MemoryField from 'MemoryField'
import EventField from 'EventField'
import CommonForm from 'CommonForm'
import ErrorSpan from 'ErrorSpan'

export default class MemoForm extends CommonForm {
   static defaultProps = {
      id: null,
      year_date: '',
      add_date: '',
      calendary_id: 0,
      calendary: '',
      event_id: 0,
      event: '',
      bind_kind: '',
      bond_to_id: 0,
      bond_to: '',
      memory_id: 0,
      memory: '',
      titles: [],
      links: [],
      descriptions: [],
   }

   static validations = {
      'Вид привязки не должен иметь значение "Не привязаный" в случае, если привязка задана': (query) => {
         return query.bond_to_id && query.bind_kind == "несвязаный"
      },
      'Вид привязки должен иметь значение "Не привязаный" в случае, если привязка отсутствует': (query) => {
         return !query.bond_to_id && query.bind_kind != "несвязаный"
      },
      'Привязаная дата не должно соответствовать текущей дате': (query) => {
         return query.bond_to && query.bond_to == query.year_date
      },
      'Минимум один заголовок должен быть задан': (query) => {
         console.log(query.titles, Object.keys(query.titles).length)
         return Object.keys(query.titles).length == 0
      },
   }

   onChildUpdate(value) {
      super.onChildUpdate(value)

      if (value.memory) {
         this.forceUpdate()
      }
   }

   render() {
      console.log("props", this.props)
      console.log("query", this.query)

      return (
         <div>
            <div className='row'>
               <CalendaryField
                  ref={e => this.r.push(e)}
                  key='calendaryId'
                  calendary_id={this.query.calendary_id}
                  calendary={this.query.calendary}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <MemoryField
                  ref={e => this.r.push(e)}
                  key='memoryId'
                  memory_id={this.query.memory_id}
                  memory={this.query.memory}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <EventField
                  ref={e => this.r.push(e)}
                  key='eventId'
                  filter_value={this.query.memory_id}
                  event_id={this.query.event_id}
                  event={this.query.event}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <YearDateField
                  ref={e => this.r.push(e)}
                  key='yearDate'
                  year_date={this.query.year_date}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <MemoBindKindField
                  ref={e => this.r.push(e)}
                  key='bindKind'
                  name='bind_kind'
                  bind_kind={this.query.bind_kind}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <DynamicField
                  ref={e => this.r.push(e)}
                  key='bondToId'
                  pathname='short_memoes'
                  field_name='bond_to_id'
                  name='bond_to'
                  key_name='memo'
                  value_name='id'
                  filter={{with_event_id: this.query.event_id, with_calendary_id: this.query.calendary_id}}
                  title='Привязаный помин'
                  placeholder='Начни ввод даты привязаного помина...'
                  bond_to_id={this.query.bond_to_id}
                  bond_to={this.query.bond_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <DateField
                  ref={e => this.r.push(e)}
                  key='addDate'
                  name='add_date'
                  title='Пора добавления'
                  add_date={this.query.add_date}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     error={this.getError(this.query)}
                     key='error' /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <TitlesCollection
                     ref={e => this.r.push(e)}
                     key='titles'
                     name='titles'
                     value={this.query.titles}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <LinksCollection
                     ref={e => this.r.push(e)}
                     key='links'
                     value={this.query.links}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={e => this.r.push(e)}
                     key='descriptions'
                     name='descriptions'
                     value={this.query.descriptions}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div></div>)}}
