import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import SearchField from 'SearchField'
import MemoModal from 'MemoModal'
import MemoRow from 'MemoRow'

export default class Memoes extends Component {
   static defaultProps = {
      memoes: {
         list: [],
         page: 1,
         total: 0,
      },
      locales: [],
      tokens: [],
   }

   state = {
      memoes: this.props.memoes.list,
      page: this.props.memoes.page,
      total: this.props.memoes.total,
      appended: 0,
      query: {
         page: this.props.memoes.page,
         with_tokens: this.props.tokens,
      },
      current: null
   }

   // system
   componentWillMount() {
      console.log("MOUNT", this.props.memoes.list)
      if (this.props.memoes.list.length == 0) {
         this.submit()
      }
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   // custom
   fetchNext() {
      if ((this.state.total > this.state.memoes.length) && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state.total, this.state.memoes.length)
         this.submit(this.state.page + 1)
      }
   }

   onMemoUpdate(memo) {
      let index = this.state.memoes.findIndex((c) => { return c.id == memo.id })
      let memoes = this.state.memoes.slice()
      let total = this.state.total
      let appended = this.state.appended

      console.log(index)
      if (index < 0) {
         memoes.unshift(memo)
         total += 1
         appended += 1
      } else {
         memoes[index] = memo
      }

      this.setState({
         memoes: memoes,
         total: total,
         current: null,
         appended: appended})
   }

   onMemoEdit(id) {
      let memo = this.state.memoes.find((m) => { return m.id == id })
      this.setState({current: memo})
   }

   onMemoClose() {
      this.setState({current: null})
   }

   onMemoRemove(id) {
      let memo = this.state.memoes.find((c) => { return c.id == id })

      $.ajax({
         method: 'DELETE',
         dataType: 'JSON',
         url: '/memoes/' + memo.id + '.json',
         success: this.onSuccessRemove.bind(this)
      })
   }

   onSuccessRemove(memo) {
      let memoes = this.state.memoes.slice()
      let index = memoes.findIndex((c) => { return c.id == memo.id })

      delete memoes[index]
      this.setState({
         memoes: memoes.filter((c) => {return c}),
         total: this.state.total - 1
      })
   }

   onSuccessLoad(memoes) {
      let new_memoes

      console.log("SUCCESS", memoes)
      if (memoes.page > 1) {
         new_memoes = this.state.memoes.slice()
         if (this.state.appended) {
            let ids = new_memoes.map((c) => { return c.id })
            memoes.list.forEach((c) => {
               if (ids.indexOf(c.id) < 0) {
                  new_memoes.push(c)
               }
            })
         } else {
            new_memoes = new_memoes.concat(memoes.list)
         }
      } else {
         new_memoes = memoes.list
      }

      this.setState({memoes: new_memoes,
                     page: memoes.page,
                     total: memoes.total})
      console.log("state", this.state)
   }

   submit(page = 1) {
      this.isRequesting = true
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      $.get('/memoes.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   onSearchUpdate(tokens) {
      this.state.query.with_tokens = tokens

      this.submit(1)
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='memoes list'>
            <div className="row">
               <form>
                  <div className="col xl3 l3 m8 s12">
                     <h4
                        className='title'>
                        Помины</h4></div>
                  <SearchField
                     wrapperClassName='col xl7 l6 m9 s8'
                     with_text={this.state.query.with_tokens.join(" ")}
                     onUpdate={this.onSearchUpdate.bind(this)} /></form>
                  <div className="col xl2 l3 m3 s4 flex">
                     <MemoModal
                        open={this.state.current}
                        {...this.state.current}
                        ref={$form => this.$form = $form}
                        onCloseMemo={this.onMemoClose.bind(this)}
                        onUpdateMemo={this.onMemoUpdate.bind(this)} /></div></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     <th>Дата</th>
                     <th>Дата добавления</th>
                     <th>Событие</th>
                     <th>Связка</th>
                     <th>Связано с датою</th>
                     <th>Календарь</th>
                     <th>Память</th>
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state.memoes.map((memo) =>
                     <MemoRow
                        key={"memo-" + memo.id}
                        locales={this.props.locales}
                        {...memo}
                        onEdit={this.onMemoEdit.bind(this)}
                        onRemove={this.onMemoRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
