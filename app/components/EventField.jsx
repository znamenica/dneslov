import FilteredDynamicField from 'FilteredDynamicField'

export default class EventField extends FilteredDynamicField {
   static defaultProps = {
      pathname: 'short_events',
      name: 'event',
      field_name: 'event_id',
      filter_key: 'with_memory_id',
      key_name: 'event',
      value_name: 'id',
      title: 'Событие',
      placeholder: 'Начни ввод имени события...',
      validations: {
         "Событие должно быть задано": /^$/
      }
   }
}
