import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

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
   }

   state = {
      memories: this.props.memories.list,
      page: this.props.memories.page,
      total: this.props.memories.total,
      appended: 0,
      query: { page: this.props.memories.page },
      current: null
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   fetchNext() {
      if (this.state.total > this.state.memories.length && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state)
         this.isRequesting = true
         this.submit(this.state.page + 1)
      }
   }

   onMemoryUpdate(memory) {
      let index = this.state.memories.findIndex((c) => { return c.slug.text == memory.slug.text })
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

      this.setState({ memories: memories, total: total, current: null, appended: appended})
   }

   onMemoryEdit(slug) {
      let memory = this.state.memories.find((m) => { return m.slug.text == slug.text })
      console.log("M", slug, memory)
      this.setState({current: memory})
   }

   onMemoryClose() {
      this.setState({current: null})
   }

   onMemoryRemove(slug) {
      let memory = this.state.memories.find((c) => { return c.slug.text == slug.text })

      $.ajax({
         method: 'DELETE',
         dataType: 'JSON',
         url: '/memories/' + memory.slug.text + '.json',
         success: this.onSuccessRemove.bind(this)
      })
   }

   onSuccessRemove(memory) {
      let memories = this.state.memories.slice()
      let index = memories.findIndex((c) => { return c.slug.text == memory.slug.text })

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
            let slugs = new_memories.map((c) => { return c.slug.text })
            memories.list.forEach((c) => {
               if (slugs.indexOf(c.slug.text) < 0) {
                  new_memories.push(c)
               }
            })
         } else {
            new_memories = new_memories.concat(memories.list)
         }
      } else {
         new_memories = memories.list
      }

      this.setState({memories: new_memories, page: memories.page})
      console.log("state", this.state)
   }

   submit(page = 1) {
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      $.get('/memories.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='memories list'>
            <div className="row">
               <div className="col m8 s6">
                  <h4
                     className='title'>
                     Памяти</h4></div>
               <div className="col m4 s6 flex">
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
                        key={memory.slug.text}
                        locales={this.props.locales}
                        {...memory}
                        onEdit={this.onMemoryEdit.bind(this)}
                        onRemove={this.onMemoryRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
