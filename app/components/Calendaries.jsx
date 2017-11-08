import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import CalendaryModal from 'CalendaryModal'
import Calendary from 'Calendary'

export default class Calendaries extends Component {
   static defaultProps = {
      calendaries: {
         list: [],
         page: 1,
         total: 0,
      },
      locales: [],
   }

   state = {
      calendaries: this.props.calendaries.list,
      page: this.props.calendaries.page,
      total: this.props.calendaries.total,
      appended: 0,
      query: { page: this.props.calendaries.page },
      current: null
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   fetchNext() {
      if (this.state.total > this.state.calendaries.length && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state)
         this.isRequesting = true
         this.submit(this.state.page + 1)
      }
   }

   onCalendaryUpdate(calendary) {
      let index = this.state.calendaries.findIndex((c) => { return c.slug.text == calendary.slug.text })
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

      this.setState({ calendaries: calendaries, total: total, current: null, appended: appended})
   }

   onCalendaryEdit(slug) {
      let calendary = this.state.calendaries.find((c) => { return c.slug.text == slug })
      this.setState({current: calendary})
   }

   onCalendaryClose() {
      this.setState({current: null})
   }

   onCalendaryRemove(slug) {
      let calendary = this.state.calendaries.find((c) => { return c.slug.text == slug })

      $.ajax({
         method: 'DELETE',
         dataType: 'JSON',
         url: '/calendaries/' + calendary.slug.text + '.json',
         success: this.onSuccessRemove.bind(this)
      })
   }

   onSuccessRemove(calendary) {
      let calendaries = this.state.calendaries.slice()
      let index = calendaries.findIndex((c) => { return c.slug.text == calendary.slug.text })

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
            let slugs = new_calendaries.map((c) => { return c.slug.text })
            calendaries.list.forEach((c) => {
               if (slugs.indexOf(c.slug.text) < 0) {
                  new_calendaries.push(c)
               }
            })
         } else {
            new_calendaries = new_calendaries.concat(calendaries.list)
         }
      } else {
         new_calendaries = calendaries.list
      }

      this.setState({calendaries: new_calendaries, page: calendaries.page})
      console.log("state", this.state)
   }

   submit(page = 1) {
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      $.get('/calendaries.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='calendaries'>
            <div className="row">
               <div className="col m8 s6">
                  <h4
                     className='title'>
                     Календари</h4></div>
               <div className="col m4 s6 flex">
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
                     <Calendary
                        key={calendary.slug.text}
                        locales={this.props.locales}
                        {...calendary}
                        slug={calendary.slug.text}
                        onEdit={this.onCalendaryEdit.bind(this)}
                        onRemove={this.onCalendaryRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
