import Records from 'Records'
import OrderForm from 'OrderForm'
import OrderRow from 'OrderRow'

export default class Orders extends Records {
   static defaultProps = {
      keyName: 'order',
      keyNames: 'orders',
      remoteNames: 'orders',
      i18n: {
         title: 'Чины',
         new: 'Новый чин',
         headers: [ 'Плашка',
                    'Краткое имя',
                    'Наименование',
                    'Описание' ],
         form: {
            close: 'Закрой',
            update: 'Обнови чин',
            create: 'Создай чин',
         }
      },
      form: OrderForm,
      row: OrderRow,
      orders: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}
