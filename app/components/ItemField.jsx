import DynamicField from 'DynamicField'

export default class ItemField extends DynamicField {
   static defaultProps = {
      pathname: 'short_items',
      key_name: 'item',
      value_name: 'id',
      name: 'item_id',
      humanized_name: 'item',
      title: 'Предмет',
      placeholder: 'Начни ввод наименования предмета...',
      validations: {},
   }
}
