import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import SearchField from 'SearchField'
import MemoryModal from 'MemoryModal'
import MemoryRow from 'MemoryRow'

export default class Memories extends Component {
   static defaultProps = {
      memories: {
         list: [],
         page: 1,
         total: 0,
      },
      locales: [],
      tokens: [],
   }

   state = {
      memories: this.props.memories.list,
      page: this.props.memories.page,
      total: this.props.memories.total,
      appended: 0,
      query: {
         page: this.props.memories.page,
         with_tokens: this.props.tokens,
      },
      current: null
   }

   // system
   componentWillMount() {
      console.log("MOUNT", this.props.memories.list)
      if (this.props.memories.list.length == 0) {
         this.submit()
      }
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   // custom
   fetchNext() {
      if ((this.state.total > this.state.memories.length) && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state)
         this.submit(this.state.page + 1)
      }
   }

   onMemoryUpdate(memory) {
      let index = this.state.memories.findIndex((c) => { return c.id == memory.id })
      let memories = this.state.memories.slice()
      let total = this.state.total
      let appended = this.state.appended

      console.log(index)
      if (index < 0) {
         memories.unshift(memory)
         total += 1
         appended += 1
      } else {
         memories[index] = memory
      }

      this.setState({
         memories: memories,
         total: total,
         current: null,
         appended: appended})
   }

   onMemoryEdit(id) {
      let memory = this.state.memories.find((m) => { return m.id == id })
      this.setState({current: memory})
   }

   onMemoryClose() {
      this.setState({current: null})
   }

   onMemoryRemove(id) {
      let memory = this.state.memories.find((c) => { return c.id == id })

      $.ajax({
         method: 'DELETE',
         dataType: 'JSON',
         url: '/memories/' + memory.id + '.json',
         success: this.onSuccessRemove.bind(this)
      })
   }

   onSuccessRemove(memory) {
      let memories = this.state.memories.slice()
      let index = memories.findIndex((c) => { return c.id == memory.id })

      delete memories[index]
      this.setState({
         memories: memories.filter((c) => {return c}),
         total: this.state.total - 1
      })
   }

   onSuccessLoad(memories) {
      let new_memories

      console.log("SUCCESS", memories)
      if (memories.page > 1) {
         new_memories = this.state.memories.slice()
         if (this.state.appended) {
            let ids = new_memories.map((c) => { return c.id })
            memories.list.forEach((c) => {
               if (ids.indexOf(c.id) < 0) {
                  new_memories.push(c)
               }
            })
         } else {
            new_memories = new_memories.concat(memories.list)
         }
      } else {
         new_memories = memories.list
      }

      this.setState({memories: new_memories,
                     page: memories.page,
                     total: memories.total})
      console.log("state", this.state)
   }

   submit(page = 1) {
      this.isRequesting = true
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      $.get('/memories.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   onSearchUpdate(tokens) {
      this.state.query.with_tokens = tokens

      this.submit(1)
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='memories list'>
            <div className="row">
               <form>
                  <div className="col xl3 l3 m8 s12">
                     <h4
                        className='title'>
                        Памяти</h4></div>
                  <SearchField
                     wrapperClassName='col xl7 l6 m9 s8'
                     with_text={this.state.query.with_tokens.join(" ")}
                     onUpdate={this.onSearchUpdate.bind(this)} /></form>
                  <div className="col xl2 l3 m3 s4 flex">
                     <MemoryModal
                        open={this.state.current}
                        {...this.state.current}
                        ref={$form => this.$form = $form}
                        onCloseMemory={this.onMemoryClose.bind(this)}
                        onUpdateMemory={this.onMemoryUpdate.bind(this)} /></div></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     <th>Краткое имя</th>
                     <th>Чин</th>
                     <th>Собор</th>
                     <th>Кол-во</th>
                     <th>Пора</th>
                     <th>Описание</th>
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state.memories.map((memory) =>
                     <MemoryRow
                        key={"memory-" + memory.id}
                        locales={this.props.locales}
                        {...memory}
                        onEdit={this.onMemoryEdit.bind(this)}
                        onRemove={this.onMemoryRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
