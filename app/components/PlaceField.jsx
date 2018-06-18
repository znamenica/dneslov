import DynamicField from 'DynamicField'

export default class PlaceField extends DynamicField {
   static defaultProps = {
      pathname: 'short_places',
      name: 'place',
      field_name: 'place_id',
      key_name: 'name',
      value_name: 'id',
      title: 'Место',
      placeholder: 'Начни ввод наименования места...',
      validations: {},
   }
}
