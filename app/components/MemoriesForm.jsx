import { Component } from 'react'
import { CookiesProvider } from 'react-cookie'

import PickMeUpCalendar from 'PickMeUpCalendar'
import CalendariesCloud from 'CalendariesCloud'
import SearchField from 'SearchField'
import SearchConditions from 'SearchConditions'
import MemorySpans from 'MemorySpans'
import Memory from 'Memory'
import Intro from 'Intro'

export default class MemoriesForm extends Component {
   static defaultProps = {
      date: '',
      julian: false,
      calendaries_used: [],
      calendaries_cloud: [],
      tokens: [],
      memories: {
         list: [],
         page: 1,
         total: 0,
      },
      memory: null,
   }

   state = {
      mounted: false,
      memories: this.props.memories,
      memory: this.props.memory,
      query: {
         page: this.props.memories.page,
         with_date: [ this.props.date, this.props.julian ],
         in_calendaries: this.props.calendaries_used,
         with_tokens: this.props.tokens
      }
   }

   // system
   componentDidMount() {
      this.setState({mounted: true})
   }

   // custom
   calendariesUsed() {
      return this.state.query.in_calendaries.map((slug) => {
         return this.props.calendaries_cloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         })
      })
   }

   onCloudAct(data) {
      this.state.query.in_calendaries.push(data.slug)

      this.submit()
   }

   onSearchAct(data) {
      if (data.date) {
         this.state.query.with_date = []
      } else if (data.slug) {
         delete this.state.query.in_calendaries[this.state.query.in_calendaries.indexOf(data.slug)]
      } else if (data.token) {
         delete this.state.query.with_tokens[this.state.query.with_tokens.indexOf(data.token)]
      }

      this.submit()
   }

   onSearchUpdate(tokens) {
      this.state.query.with_tokens = tokens

      this.submit()
   }

   onCalendarUpdate(value) {
      Object.keys(value).forEach((key) => {
         this.state.query[key] = value[key]
      })

      this.submit()
   }

   onFetchNext() {
      this.submit(this.state.query.page + 1)
   }

   onSuccessLoad(memories) {
      let slugs = memories.list.map((m) => { return m.slug })
      console.log("AJAX SUCCESS", slugs)
      if (memories.page > 1) {
         let new_memories = this.state.memories
         new_memories.list = new_memories.list.concat(memories.list)
         this.setState({memories: new_memories, memory: null})
      } else {
         this.setState({memories: memories, memory: null})
      }
      console.log("state", this.state)
      history.pushState({ 'json': memories }, '', '/')
   }

   submit(page = 1) {
      this.state.query.page = page

      console.log("Sending...", this.state)

      $.get('/index.json', this.state.query, this.onSuccessLoad.bind(this), 'JSON')
   }

   onExitIntro() {
   }

   render() {
      console.log("props", this.props)
      console.log("length", this.state.memories.list.length)
      console.log("total", this.state.memories.total)

      return (
         <div className='row'>
            <CookiesProvider>
               <Intro
                  enabled={this.state.mounted} />
            </CookiesProvider>
            <form>
               <div className='col s12 m5 l4 xl3'>
                  <div className='hidden' id='calendary' />
                  <div className='row'>
                     <PickMeUpCalendar
                        onUpdate={this.onCalendarUpdate.bind(this)} />
                     <CalendariesCloud
                        calendaries={this.props.calendaries_cloud}
                        calendaries_used={this.props.calendaries_used}
                        onAct={this.onCloudAct.bind(this)} /></div></div>
               <div className='col s12 m7 l8 xl9'>
                  {this.state.memory &&
                     <Memory
                        memory={this.props.memory} />}
                  {! this.state.memory &&
                     <div>
                        <div className='row'>
                           <SearchField
                              wrapperClassName='col xl12 l12 l12 s12'
                              with_text={this.state.query.with_tokens.join(" ")}
                              onUpdate={this.onSearchUpdate.bind(this)} /></div>
                        <SearchConditions
                           date={this.state.query.with_date[0]}
                           calendaries={this.calendariesUsed()}
                           query={this.state.query.with_tokens}
                           onAct={this.onSearchAct.bind(this)} />
                        <MemorySpans
                           memories={this.state.memories.list}
                           total_memories={this.state.memories.total}
                           onFetchNext={this.onFetchNext.bind(this)}/></div>}</div></form></div>)}}
