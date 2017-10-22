import { Component } from 'react'
import PickMeUpCalendar from 'PickMeUpCalendar'
import CalendariesCloud from 'CalendariesCloud'
import SearchField from 'SearchField'
import SearchConditions from 'SearchConditions'
import MemorySpans from 'MemorySpans'
import Memory from 'Memory'

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
      memories: this.props.memories,
      memory: this.props.memory,
      query: {
         page: this.props.memories.page,
         with_date: [ this.props.date, this.props.julian ],
         in_calendaries: this.props.calendaries_used,
         with_tokens: this.props.tokens
      }
   }

   calendariesUsed = () => {
      return this.state.query.in_calendaries.map((slug) => {
         return this.props.calendaries_cloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         })
      })
   }

   onCloudAct = (data) => {
      this.state.query.in_calendaries.push(data.slug)

      this.submit()
   }

   onSearchAct = (data) => {
      if (data.date) {
         this.state.query.with_date = []
      } else if (data.slug) {
         delete this.state.query.in_calendaries[this.state.query.in_calendaries.indexOf(data.slug)]
      } else if (data.token) {
         delete this.state.query.with_tokens[this.state.query.with_tokens.indexOf(data.token)]
      }

      this.submit()
   }

   onSearchUpdate = (tokens) => {
      this.state.query.with_tokens = tokens

      this.submit()
   }

   onCalendarUpdate = (value) => {
      Object.keys(value).forEach((key) => {
         this.state.query[key] = value[key]
      })

      this.submit()
   }

   onFetchNext = () => {
      this.submit(this.state.query.page + 1)
   }

   submit = (page = 1) => {
      let _this = this
      this.state.query.page = page

      console.log("Sending...", this.state)

      $.get('/index.json', this.state.query, (memories) => {
         let slugs = memories.list.map((m) => { return m.slug })
         console.log("AJAX SUCCESS", slugs)
         if (memories.page > 1) {
            let new_memories = this.state.memories
            new_memories.list = new_memories.list.concat(memories.list)
            _this.setState({memories: new_memories, memory: null})
         } else {
            _this.setState({memories: memories, memory: null})
         }
         console.log("state", this.state)
         history.pushState({ 'json': memories }, '', '/')
      }, 'JSON')
   }

   render = () => {
      console.log("props", this.props)
      console.log("length", this.state.memories.list.length)
      console.log("total", this.state.memories.total)

      return (
         <div className='row'>
            <form>
               <div className='col s12 m5 l4 xl3'>
                  <div className='hidden' id='calendary' />
                  <div className='row'>
                     <PickMeUpCalendar
                        onUpdate={this.onCalendarUpdate} />
                     <CalendariesCloud
                        calendaries={this.props.calendaries_cloud}
                        calendaries_used={this.props.calendaries_used}
                        onAct={this.onCloudAct} /></div></div>
               <div className='col s12 m7 l8 xl9'>
                  {this.state.memory &&
                     <Memory
                        memory={this.props.memory} />}
                  {! this.state.memory &&
                     <div>
                        <SearchField
                           with_text={this.state.query.with_tokens.join(" ")}
                           onUpdate={this.onSearchUpdate} />
                        <SearchConditions
                           date={this.state.query.with_date[0]}
                           calendaries={this.calendariesUsed()}
                           query={this.state.query.with_tokens}
                           onAct={this.onSearchAct} />
                        <MemorySpans
                           memories={this.state.memories.list}
                           total_memories={this.state.memories.total}
                           onFetchNext={this.onFetchNext}/></div>}</div></form></div>)}}