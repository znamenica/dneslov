import DynamicField from 'DynamicField'

export default class OrderField extends DynamicField {
   static defaultProps = {
      title: 'Чин',
      pathname: 'short_orders',
      name: 'order_id',
      humanized_name: 'order',
      key_name: 'order',
      value_name: 'id',
      placeholder: 'Начни ввод наименования чина...',
   }
}
