import DynamicField from 'DynamicField'

export default class PlaceField extends DynamicField {
   static defaultProps = {
      pathname: 'places',
      name: 'place_id',
      pure_name: 'place',
      key_name: 'name',
      value_name: 'id',
      title: 'Место',
      placeholder: 'Введи место...',
   }
}
