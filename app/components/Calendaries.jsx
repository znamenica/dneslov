import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import SearchField from 'SearchField'
import CalendaryModal from 'CalendaryModal'
import CalendaryRow from 'CalendaryRow'

export default class Calendaries extends Component {
   static defaultProps = {
      calendaries: {
         list: [],
         page: 1,
         total: 0,
      },
      locales: [],
      tokens: [],
   }

   state = {
      calendaries: this.props.calendaries.list,
      page: this.props.calendaries.page,
      total: this.props.calendaries.total,
      appended: 0,
      query: {
         page: this.props.calendaries.page,
         with_tokens: this.props.tokens,
      },
      current: null
   }

   // system
   componentWillMount() {
      console.log("MOUNT", this.props.calendaries.list)
      if (this.props.calendaries.list.length == 0) {
         this.submit()
      }
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   // custom
   fetchNext() {
      if (this.state.total > this.state.calendaries.length && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state)
         this.submit(this.state.page + 1)
      }
   }

   onCalendaryUpdate(calendary) {
      let index = this.state.calendaries.findIndex((c) => { return c.id == calendary.id })
      let calendaries = this.state.calendaries.slice()
      let total = this.state.total
      let appended = this.state.appended

      console.log(index)
      if (index < 0) {
         calendaries.unshift(calendary)
         total += 1
         appended += 1
      } else {
         calendaries[index] = calendary
      }

      this.setState({
         calendaries: calendaries,
         total: total,
         current: null,
         appended: appended})
   }

   onCalendaryEdit(id) {
      let calendary = this.state.calendaries.find((c) => { return c.id == id })
      this.setState({current: calendary})
   }

   onCalendaryRemove(id) {
      let calendary = this.state.calendaries.find((c) => { return c.id == id })

      $.ajax({
         method: 'DELETE',
         dataType: 'JSON',
         url: '/calendaries/' + calendary.id + '.json',
         success: this.onSuccessRemove.bind(this)
      })
   }

   onCalendaryClose() {
      this.setState({current: null})
   }

   onSuccessRemove(calendary) {
      let calendaries = this.state.calendaries.slice()
      let index = calendaries.findIndex((c) => { return c.id == calendary.id })

      delete calendaries[index]
      this.setState({
         calendaries: calendaries.filter((c) => {return c}),
         total: this.state.total - 1
      })
   }

   onSuccessLoad(calendaries) {
      let new_calendaries

      console.log("SUCCESS", calendaries)
      if (calendaries.page > 1) {
         new_calendaries = this.state.calendaries.slice()
         if (this.state.appended) {
            let ids = new_calendaries.map((c) => { return c.id })
            calendaries.list.forEach((c) => {
               if (ids.indexOf(c.id) < 0) {
                  new_calendaries.push(c)
               }
            })
         } else {
            new_calendaries = new_calendaries.concat(calendaries.list)
         }
      } else {
         new_calendaries = calendaries.list
      }

      this.setState({calendaries: new_calendaries,
                     page: calendaries.page,
                     total: calendaries.total})
      console.log("state", this.state)
   }

   submit(page = 1) {
      this.isRequesting = true
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      $.get('/calendaries.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   onSearchUpdate(tokens) {
      this.state.query.with_tokens = tokens

      this.submit(1)
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='calendaries list'>
            <div className="row">
               <form>
                  <div className="col xl3 l3 m8 s12">
                     <h4
                        className='title'>
                        Календари</h4></div>
                  <SearchField
                     wrapperClassName='col xl7 l6 m9 s8'
                     with_text={this.state.query.with_tokens.join(" ")}
                     onUpdate={this.onSearchUpdate.bind(this)} /></form>
                  <div className="col xl2 l3 m3 s4 flex">
                     <CalendaryModal
                        open={this.state.current}
                        {...this.state.current}
                        ref={$form => this.$form = $form}
                        onCloseCalendary={this.onCalendaryClose.bind(this)}
                        onUpdateCalendary={this.onCalendaryUpdate.bind(this)} /></div></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     <th>Имя</th>
                     <th><i className='tiny material-icons'>thumb_up</i></th>
                     <th>Язык</th>
                     <th>Азбука</th>
                     <th>Автор</th>
                     <th>Дата</th>
                     <th>Собор</th>
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state.calendaries.map((calendary) =>
                     <CalendaryRow
                        key={"calendary-" + calendary.id}
                        locales={this.props.locales}
                        {...calendary}
                        slug={calendary.slug.text}
                        onEdit={this.onCalendaryEdit.bind(this)}
                        onRemove={this.onCalendaryRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
