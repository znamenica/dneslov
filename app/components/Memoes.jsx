import Records from 'Records'
import MemoForm from 'MemoForm'
import MemoRow from 'MemoRow'

export default class Memoes extends Records {
   static defaultProps = {
      keyName: 'memo',
      keyNames: 'memoes',
      remoteNames: 'memoes',
      i18n: {
         title: 'Помины',
         new: 'Новый помин',
         headers: [
                    'Чин',
                    'Память',
                    'Дата',
                    'Событие',
                    'Связка с...',
                    'Добавлено...',
                    'Календарь',
         ],
         form: {
            close: 'Закрой',
            update: 'Обнови помин',
            create: 'Создай помин',
         }
      },
      form: MemoForm,
      row: MemoRow,
      memoes: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}
