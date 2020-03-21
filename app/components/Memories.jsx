import Records from 'Records'
import MemoryForm from 'MemoryForm'
import MemoryRow from 'MemoryRow'

export default class Memories extends Records {
   static defaultProps = {
      keyName: 'memory',
      keyNames: 'memories',
      remoteNames: 'memories',
      i18n: {
         title: 'Памяти',
         new: 'Новая память',
         headers: [ 'Краткое имя',
                    'Чин',
                    'Собор',
                    'Кол-во',
                    'Пора',
                    'Описание' ],
         form: {
            close: 'Закрой',
            update: 'Обнови память',
            create: 'Создай память',
         }
      },
      form: MemoryForm,
      row: MemoryRow,
      memories: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}
