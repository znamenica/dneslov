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
         headers: [ 'Дата',
                    'Дата добавления',
                    'Событие',
                    'Связка',
                    'Связано с датою',
                    'Календарь',
                    'Память' ],
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
