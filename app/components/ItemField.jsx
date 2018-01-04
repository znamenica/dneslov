import DynamicField from 'DynamicField'

export default class ItemField extends DynamicField {
   static defaultProps = {
      pathname: 'short_items',
      name: 'item',
      field_name: 'item_id',
      key_name: 'item',
      value_name: 'id',
      title: 'Предмет',
      placeholder: 'Начни ввод наименования предмета...',
      validations: {},
   }
}
