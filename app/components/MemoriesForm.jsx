import { Component } from 'react'
import { CookiesProvider } from 'react-cookie'
import { merge } from 'merge-anything'
import * as Axios from 'axios'
import crypto from 'crypto'

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

   state = {}

   // system
   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         let state = {
               prevProps: props,
               default_calendary_slug: props.calendaries_cloud[0],
               memories: props.memories.list,
               memoriesTotal: props.memories.total,
               memory: props.memory,
               query: {
                  page: props.memories.page,
                  with_date: [ props.date, props.julian ],
                  in_calendaries: props.calendaries_used.slice(),
                  with_tokens: props.tokens
               }
             }

         history.pushState({id: MemoriesForm.hashFromState(state)}, 'Днеслов', '/')
         return state
      }

      return null
   }

   static hashFromState(state) {
      let json = JSON.stringify(state),
          hash = crypto.createHash('sha1').update(json).digest('hex')

      console.log("[hashFromState] > id:", hash)
      console.log("[hashFromState] > json string:", json)
      sessionStorage.setItem(hash, json)

      return hash
   }

   updateState(state) {
      let hash = MemoriesForm.hashFromState(state)

      history.replaceState({id: hash}, document.title)
      this.setState(state)
   }

   componentDidMount() {
      window.onpopstate = this.onPopState.bind(this)
   }

   componentWillUnmount() {
      window.onpopstate = null
   }

   // custom
   calendariesUsed() {
      return this.state.query.in_calendaries.map((slug) => {
         return this.props.calendaries_cloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         }, false)
      })
   }

   onCloudAct(data) {
      this.state.query.in_calendaries.push(data.slug)

      this.submit()
   }

   onSearchAct(data) {
      let index

      if (data.date) {
         this.state.query.with_date = []
      } else if (data.slug) {
         index = this.state.query.in_calendaries.indexOf(data.slug)
         this.state.query.in_calendaries.splice(index, 1)
      } else if (data.token) {
         index = this.state.query.with_tokens.indexOf(data.token)
         this.state.query.with_tokens.splice(index, 1)
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
      if (! this.isNextRequesting) {
         console.log("NEXT")
         this.isNextRequesting = true
         this.submit(this.state.query.page + 1)
      }
   }

   submit(page = 1) {
      this.state.query.page = page

      console.log("Sending...", this.state)

      let request = {
         data: this.state.query,
         url: '/index.json',
      }

      document.body.classList.add('in-progress')

      Axios.get(request.url, { params: request.data })
        .then(this.onMemoriesLoadSuccess.bind(this))
        .catch(this.onMemoriesLoadFailure.bind(this))
   }

   onMemoriesLoadSuccess(response) {
      let state, memories = response.data

      console.log("LOADED", memories)

      if (memories.page > 1) {
         let newMemories = this.state.memories.concat(memories.list)
         state = merge({}, this.state, {
            memories: newMemories,
            memoriesTotal: memories.total,
            memory: null})
      } else {
         state = merge({}, this.state, {
            memories: memories.list,
            memoriesTotal: memories.total,
            memory: null})
      }

      this.updateState(state)
      this.isNextRequesting = false
   }

   onMemoriesLoadFailure(response) {
      console.log("FAILURE", response)

      let query = merge(this.state.query, { in_calendaries: this.props.calendaries_used.slice() })
      document.body.classList.remove('in-progress')
      this.updateState({query: query})
      this.isNextRequesting = false
   }

   onLoadRequest(slug) {
      let request = {
         url: '/' + slug + '.json',
      }

      document.body.classList.add('in-progress')

      Axios.get(request.url)
        .then(this.onMemoryLoadSuccess.bind(this))
        .catch(this.onMemoriesLoadFailure.bind(this))
   }

   onMemoryLoadSuccess(response) {
      let memory = response.data,
          state = merge({}, this.state, { memory: memory })

      console.log("[onMemoryLoadSuccess] > memory:", memory)

      history.pushState({key: 2},
                        'Днесловъ – ' + memory.short_name,
                        '/' + memory.slug + '#' + this.props.calendaries_used[0])
      document.body.classList.remove('in-progress')
      this.updateState(state)
   }

   onPopState(e) {
      console.log("[onPopState] > session:", e.state)

      if (e.state) {
         let state = JSON.parse(sessionStorage.getItem(e.state.id))
         this.setState(state)
      }
   }

   render() {
      console.log("[render] > props:", this.props, "state:", this.state)

      return (
         [<header>
            <nav className='terracota'>
               <div className="nav-wrapper">
                  <a
                     className='brand-logo'
                     href='/'
                     alt="Днеслов">
                     <img
                        src="dneslov-title.png" /></a>
                  <div className="right">
                     <div className='moon' /></div></div></nav></header>,
         <main>
            <div className='container'>
               <div className='row'>
                  <CookiesProvider>
                     <Intro />
                  </CookiesProvider>
                  <form>
                     <div className='col s12 m5 l3 xl2'>
                        <div className='hidden' id='calendary' />
                        <div className='row'>
                           <PickMeUpCalendar
                              onUpdate={this.onCalendarUpdate.bind(this)} />
                           <CalendariesCloud
                              calendaries={this.props.calendaries_cloud}
                              calendaries_used={this.state.query.in_calendaries}
                              onAct={this.onCloudAct.bind(this)} /></div></div>
                     <div className='col s12 m7 l9 xl10'>
                        {this.state.memory &&
                           <Memory
                              key='memory'
                              selected_calendaries={this.state.query.in_calendaries}
                              {...this.state.memory} />}
                        {! this.state.memory &&
                           <div>
                              <div className='row'>
                                 <SearchField
                                    wrapperClassName='col xl12 l12 m12 s12'
                                    with_text={this.state.query.with_tokens.join(" ")}
                                    onUpdate={this.onSearchUpdate.bind(this)} /></div>
                              <SearchConditions
                                 date={this.state.query.with_date[0]}
                                 calendaries={this.calendariesUsed()}
                                 query={this.state.query.with_tokens}
                                 onAct={this.onSearchAct.bind(this)} />
                              <MemorySpans
                                 memories={this.state.memories}
                                 total_memories={this.state.memoriesTotal}
                                 calendaries_cloud={this.state.query.in_calendaries}
                                 onLoadRequest={this.onLoadRequest.bind(this)}
                                 onFetchNext={this.onFetchNext.bind(this)}/></div>}</div></form></div></div></main>])}}
