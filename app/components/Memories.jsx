import Records from 'Records'
import MemoryModal from 'MemoryModal'
import MemoryRow from 'MemoryRow'

export default class Memories extends Records {
   static defaultProps = {
      keyName: 'memory',
      keyNames: 'memories',
      remoteNames: 'memories',
      title: 'Памяти',
      headers: [ 'Краткое имя',
                 'Чин',
                 'Собор',
                 'Кол-во',
                 'Пора',
                 'Описание' ],
      modal: MemoryModal,
      row: MemoryRow,
      memories: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}
