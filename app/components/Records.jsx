import { Component } from 'react'
import PropTypes from 'prop-types'
import ReactScrollPagination from '@majioa/react-scroll-pagination'
import axios from 'axios'
import { merge } from 'merge-anything'
import SearchField from 'SearchField'

import Modal from 'Modal'
import Row from 'Row'

export default class Records extends Component {
   static defaultProps = {
      records: {
         list: [],
         page: 0,
         total: 0,
      },
   }

   static propTypes = {
      object: PropTypes.object.isRequired,
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            prevProps: props,
            page: props.page,
            records: props.records?.list || [],
            page: props.records?.page || 0,
            total: props.records?.total || 0,
            query: {
               p: props.records?.page || 0,
               q: null,
            },
            appended: 0,
            current: null
         }
      }

      return null
   }

   // system
   state = {}

   constructor(props) {
      super(props)

      this.onRecordUpdate = this.onRecordUpdate.bind(this)
      this.onModalClose = this.onModalClose.bind(this)
   }

   componentDidMount() {
      this.submit()
      document.addEventListener('dneslov-record-stored', this.onRecordUpdate, { passive: true })
      document.addEventListener('dneslov-modal-close', this.onModalClose, { passive: true })
   }

   componentWillUnmount() {
      console.log("[componentWillUnmount] <<<")
      document.removeEventListener('dneslov-record-stored', this.onRecordUpdate)
      document.removeEventListener('dneslov-modal-close', this.onModalClose)
   }

   componentDidUpdate(nextProps) {
      if (this.props != nextProps) {
         this.submit()
      }
   }

   shouldComponentUpdate(nextProps, nextState) {
      console.debug("[shouldComponentUpdate] ** nextState:", nextState, "this.state:", this.state)
      return JSON.stringify(nextState.query) !== JSON.stringify(this.state.query) ||
             nextState.current != this.state.current ||
             nextState.page != this.state.page
   }

   // custom
   fetchNext() {
      console.log("[fetchNext] * this.state:", this.state)
      if ((this.state.total > this.state.records.length) && ! this.isRequesting) {
         this.submit(this.state.page + 1)
      }
   }

   onRecordUpdate(e) {
      let record = e.detail,
          index = this.state.records.findIndex((r) => { return r.id == record.id }),
          records = this.state.records.slice(),
          total = this.state.total,
          appended = this.state.appended

      console.log("[onRecordUpdate] * record:", record, "index:", index)

      if (index < 0) {
         records.unshift(record)
         total += 1
         appended += 1
      } else {
         records[index] = record
      }

      let state = {
            records: records,
            total: total,
            appended: appended,
          },
          ce = new CustomEvent('dneslov-modal-close', { detail: state })

      document.dispatchEvent(ce)
   }

   onRecordEdit(id) {
      console.log("[onRecordEdit] <<< ")
      let record = this.state.records.find((r) => { return r.id == id })
      this.setState({current: record})
   }

   onRecordRemove(id) {
      let request = {
         url: '/' + this.props.meta.remoteNames + '/' + id + '.json',
         method: 'delete'
      }

      axios(request).then(this.onSuccessRemove.bind(this))
   }

   onModalClose(e) {
      console.log("[onModalClose] <<< ", e)
      this.setState(merge({ current: null }, e.detail || {}))
   }

   onSuccessRemove(response) {
      let record = response.data, records = this.state.records.slice()

      this.setState({
         records: records.filter((r) => { return r.id == record.id }),
         total: this.state.total - 1
      })
   }

   onSuccessLoad(response) {
      let new_records, new_page, new_state, records = response.data

      console.log("[onSuccessLoad] > response", response)
      console.log("[onSuccessLoad] > records", records)
      if (records.page > 1 || !this.state.records) {
         new_records = this.state.records.slice()
         if (this.state.appended) {
            let ids = new_records.map((c) => { return c.id })
            records.list.forEach((c) => {
               if (ids.indexOf(c.id) < 0) {
                  new_records.push(c)
               }
            })
            new_page = response.config.params.p
         } else {
            new_records = new_records.concat(records.list)
            new_page = response.config.params.p
         }
      } else {
         new_records = records.list
         new_page = response.config.params.p
      }

      new_state = {
         records: new_records,
         total: records.total,
         page: new_page,
         query: merge(this.state.query,
                     {
                        q: response.config.params.q,
                        p: response.config.params.p
                     }),
      }

      console.log("[onSuccessLoad] * ", response.config.url)
      document.body.classList.remove('in-progress')

      if (response.config.url === '/' + this.props.meta.remoteNames + '.json') {
         console.log("[onSuccessLoad] * state changes", new_state)
         this.setState(new_state)
      }
   }

   submit(page = 1, tokens = this.state.query.q) {
      let query = merge(this.state.query, { p: page, q: tokens }),
          request = {
            url: '/' + this.props.meta.remoteNames +'.json',
          }

      this.isRequesting = true

      console.log("[submit] * Sending...", query)
      document.body.classList.add('in-progress')

      axios.get(request.url, { params: query } )
           .then(this.onSuccessLoad.bind(this))
           .catch((error) => {})
           .then(() => {
               document.body.classList.remove('in-progress')
               this.isRequesting = false
           })
   }

   onSearchUpdate(tokens) {
      this.submit(1, tokens)
   }

   isIcon(header) {
      return header == 'thumb_up'
   }

   isTitle(header) {
      return !this.isIcon(header)
   }

   newRecord() {
      this.setState({ current: {} })
   }

   render() {
      console.log("[render] * this.props:", this.props, "this.state:", this.state)

      return [
         <div>
            <Modal
               meta={this.props.meta}
               data={this.state.current} /></div>,
         <div className={this.props.meta.remoteNames + ' list'}>
            <div className="row">
               <form>
                  <div className="col xl3 l4 m6 s12">
                     <h4
                        className='title'>
                        {this.props.meta.title}</h4></div>
                  <div className='col xl9 l8 m6 s12'>
                     <SearchField
                        wrapperClassName=''
                        with_text={this.state.query.q}
                        onUpdate={this.onSearchUpdate.bind(this)} />
                     <a
                        className="waves-effect waves-light btn modal-trigger"
                        onClick={this.newRecord.bind(this)} >
                           {this.props.meta.new}</a></div></form></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     {Object.values(this.props.meta.row).map((header) =>
                        <th>
                           {this.isIcon(header.title) &&
                              <i className='tiny material-icons'>{header.title}</i>}
                           {this.isTitle(header.title) &&
                              header.title}</th>)}
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state.records.map((record) =>
                     <Row
                        key={this.props.meta.remoteName + "-" + record.id}
                        value={record}
                        meta={this.props.meta.row}
                        default={this.props.meta.default}
                        remove={this.props.meta.remove}
                        locales={this.props.locales || []}
                        onEdit={this.onRecordEdit.bind(this)}
                        onRemove={this.onRecordRemove.bind(this)} />)}</tbody></table>
            <ReactScrollPagination
               excludeElement='header'
               loadedTotal={this.props.records.list.length}
               total={this.state.total}
               fetchFunc={this.fetchNext.bind(this)} /></div>]}}
