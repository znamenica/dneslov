import DynamicField from 'DynamicField'
import OrdersCollection from 'OrdersCollection'
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
import { matchEmptyObject } from 'matchers'

export default class MemoForm extends CommonForm {
   static defaultProps = {
      id: null,
      year_date: '',
      add_date: '',
      calendary_id: undefined,
      calendary: '',
      event_id: undefined,
      event: '',
      bind_kind: '',
      bond_to_id: undefined,
      bond_to: '',
      memory_id: undefined,
      memory: '',
      memo_orders: [],
      titles: [],
      links: [],
      descriptions: [],

      remoteName: 'memo',
      remoteNames: 'memoes',
      
      meta: {
         bind_kind: {
            validations: {
               'Вид привязки не должен иметь значение "Не привязаный" в случае, если привязка задана': (value, context) => {
                  return context.bond_to_id && value == "несвязаный"
               },
               'Вид привязки должен иметь значение "Не привязаный" в случае, если привязка отсутствует': (value, context) => {
                  return !context.bond_to_id && value != "несвязаный"
               },
            },
         },
         bond_to_id: {
            validations: {
               'Привязаная дата не должна соответствовать текущей дате': (value, context) => {
                  return value && context.bond_to == context.year_date
               }
            },
         },
         memo_orders: {
            validations: {
               'Минимум один чин должен быть задан':  matchEmptyObject
            }
         },
         titles: {
            validations: {
               'Минимум один заголовок должен быть задан':  matchEmptyObject
            }
         }
      },
   }

   static getCleanState() {
      return {
         id: undefined,
         year_date: '',
         add_date: '',
         calendary_id: undefined,
         calendary: '',
         event_id: undefined,
         event: '',
         bind_kind: '',
         bond_to_id: undefined,
         bond_to: '',
         memory_id: 0,
         memory: '',
         memo_orders: [],
         descriptions: [],
         titles: [],
         links: [],
      }
   }

   renderContent() {
      return [
         <CalendaryField
            key='calendaryId'
            name='calendary_id'
            humanized_name='calendary'
            value={this.state.query.calendary_id}
            humanized_value={this.state.query.calendary}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <MemoryField
            key='memoryId'
            name='memory_id'
            humanized_name='memory'
            value={this.state.query.memory_id}
            humanized_value={this.state.query.memory}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <EventField
            key='eventId'
            name='event_id'
            humanized_name='event'
            filter_value={this.state.query.memory_id}
            value={this.state.query.event_id}
            humanized_value={this.state.query.event}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <YearDateField
            key='yearDate'
            name='year_date'
            value={this.state.query.year_date}
            wrapperClassName='input-field col xl2 l2 m6 s12' />,
         <MemoBindKindField
            key='bindKind'
            name='bind_kind'
            value={this.state.query.bind_kind}
            validations={this.props.meta.bind_kind.validations}
            validation_context={this.state.query}
            wrapperClassName='input-field col xl3 l3 m6 s12' />,
         <DynamicField
            key='bondToId'
            pathname='short_memoes'
            name='bond_to_id'
            humanized_name='bond_to'
            key_name='memo'
            value_name='id'
            filter={{with_event_id: this.state.query.event_id, with_calendary_id: this.state.query.calendary_id}}
            title='Привязаный помин'
            placeholder='Начни ввод даты привязаного помина...'
            value={this.state.query.bond_to_id}
            humanized_value={this.state.query.bond_to}
            validations={this.props.meta.bond_to_id.validations}
            validation_context={this.state.query}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <DateField
            key='addDate'
            name='add_date'
            title='Пора добавления'
            value={this.state.query.add_date}
            wrapperClassName='input-field col xl3 l3 m6 s12' />,
         <OrdersCollection
            key='memo_orders'
            name='memo_orders'
            value={this.state.query.memo_orders}
            validations={this.props.meta.memo_orders.validations}/>,
         <TitlesCollection
            key='titles'
            name='titles'
            value={this.state.query.titles}
            validations={this.props.meta.titles.validations}/>,
         <LinksCollection
            key='links'
            value={this.state.query.links} />,
         <DescriptionsCollection
            key='descriptions'
            name='descriptions'
            value={this.state.query.descriptions} />,
         <ErrorSpan
            appendClassName='col xl12 l12 m12 s12'
            error={this.getErrorText(this.state.query)} />]
   }
}
