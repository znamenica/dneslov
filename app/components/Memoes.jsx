import Records from 'Records'
import MemoModal from 'MemoModal'
import MemoRow from 'MemoRow'

export default class Memoes extends Records {
   static defaultProps = {
      keyName: 'memo',
      keyNames: 'memoes',
      remoteNames: 'memoes',
      title: 'Помины',
      headers: [ 'Дата',
                 'Дата добавления',
                 'Событие',
                 'Связка',
                 'Связано с датою',
                 'Календарь',
                 'Память' ],
      modal: MemoModal,
      row: MemoRow,
      memoes: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}
