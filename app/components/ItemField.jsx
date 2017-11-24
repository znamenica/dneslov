import DynamicField from 'DynamicField'

export default class ItemField extends DynamicField {
   static defaultProps = {
      pathname: 'items',
      name: 'item_id',
      key_name: 'name',
      value_name: 'id',
      title: 'Предмет',
      placeholder: 'Избери предмет...',
   }
}
