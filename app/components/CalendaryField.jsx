import DynamicField from 'DynamicField'

export default class CalendaryField extends DynamicField {
   static defaultProps = {
      pathname: 'short_calendaries',
      name: 'calendary',
      field_name: 'calendary_id',
      key_name: 'calendary',
      value_name: 'id',
      title: 'Календарь',
      placeholder: 'Начни ввод наименования календаря...',
      validations: {
         "Календарь должен быть задан": /^$/
      }
   }
}
