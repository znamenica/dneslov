import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactScrollPagination from 'react-scroll-pagination/src/index'
import * as Axios from 'axios'

import SearchField from 'SearchField'

export default class Records extends Component {
   static propTypes = {
      keyName: PropTypes.string.isRequired,
      keyNames: PropTypes.string.isRequired,
      remoteNames: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      headers: PropTypes.array.isRequired,
   }

   state = {
      [this.props.keyNames]: this.props[this.props.keyNames].list,
      page: this.props[this.props.keyNames].page,
      total: this.props[this.props.keyNames].total,
      query: {
         page: this.props[this.props.keyNames].page,
         with_tokens: this.props.tokens || [],
      },
      appended: 0,
      current: null
   }

   // system
   componentWillMount() {
      console.log("MOUNT", this.props[this.props.keyNames].list)
      if (this.props[this.props.keyNames].list.length == 0) {
         this.submit()
      }
   }

   componentDidUpdate(nextProps) {
      this.isRequesting = false
   }

   // custom
   fetchNext() {
      if ((this.state.total > this.state[this.props.keyNames].length) && ! this.isRequesting) {
         console.log("FETCH NEXT FOR", this.state)
         this.submit(this.state.page + 1)
      }
   }

   onRecordUpdate(record) {
      let index = this.state[this.props.keyNames].findIndex((r) => { return r.id == record.id })
      let records = this.state[this.props.keyNames].slice()
      let total = this.state.total
      let appended = this.state.appended

      console.log(index)
      if (index < 0) {
         records.unshift(record)
         total += 1
         appended += 1
      } else {
         records[index] = record
      }

      this.setState({
         [this.props.keyNames]: records,
         total: total,
         appended: appended
      })
   }

   onRecordEdit(id) {
      let record = this.state[this.props.keyNames].find((r) => { return r.id == id })
      this.setState({current: record})
   }

   onModalClose() {
      this.setState({current: null})
   }

   onRecordRemove(id) {
      let request = {
         url: '/' + this.props.remoteNames + '/' + id + '.json',
         method: 'delete'
      }

      Axios(request).then(this.onSuccessRemove.bind(this))
   }

   onSuccessRemove(response) {
      let record = response.data, records = this.state[this.props.keyNames].slice()

      this.setState({
         records: records.filter((r) => { return r.id == record.id }),
         total: this.state.total - 1
      })
   }

   onSuccessLoad(response) {
      let new_records, records = response.data

      console.log("SUCCESS", records)
      if (records.page > 1) {
         new_records = this.state[this.props.keyNames].slice()
         if (this.state.appended) {
            let ids = new_records.map((c) => { return c.id })
            records.list.forEach((c) => {
               if (ids.indexOf(c.id) < 0) {
                  new_records.push(c)
               }
            })
         } else {
            new_records = new_records.concat(records.list)
         }
      } else {
         new_records = records.list
      }

      this.setState({[this.props.keyNames]: new_records,
                     page: records.page,
                     total: records.total})
      console.log("state", this.state)
   }

   submit(page = 1) {
      let request = {
         url: '/' + this.props.remoteNames +'.json',
      }

      this.isRequesting = true
      this.state.query.page = page

      console.log("Sending...", this.state.query)

      Axios.get(request.url, { params: this.state.query })
           .then(this.onSuccessLoad.bind(this))
   }

   onSearchUpdate(tokens) {
      this.state.query.with_tokens = tokens

      this.submit(1)
   }

   isIcon(header) {
      return header == 'thumb_up'
   }

   isTitle(header) {
      return !this.isIcon(header)
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className={this.props.keyNames + ' list'}>
            <div className="row">
               <form>
                  <div className="col xl3 l3 m8 s12">
                     <h4
                        className='title'>
                        {this.props.title}</h4></div>
                  <SearchField
                     wrapperClassName='col xl7 l6 m9 s8'
                     with_text={this.state.query.with_tokens.join(" ")}
                     onUpdate={this.onSearchUpdate.bind(this)} /></form>
                  <div className="col xl2 l3 m3 s4 flex">
                     <this.props.modal
                        open={this.state.current}
                        {...this.state.current}
                        ref={$form => this.$form = $form}
                        onCloseModal={this.onModalClose.bind(this)}
                        onUpdateRecord={this.onRecordUpdate.bind(this)} /></div></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     {this.props.headers.map((header) =>
                        <th>
                           {this.isIcon(header) &&
                              <i className='tiny material-icons'>{header}</i>}
                           {this.isTitle(header) &&
                              header}</th>)}
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state[this.props.keyNames].map((record) =>
                     <this.props.row
                        key={this.props.keyName + "-" + record.id}
                        locales={this.props.locales || []}
                        {...record}
                        onEdit={this.onRecordEdit.bind(this)}
                        onRemove={this.onRecordRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               fetchFunc={this.fetchNext.bind(this)} /></div>)}}
