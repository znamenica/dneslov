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
      measure: "юлианский",
      calendaries_used: [],
      calendaries_cloud: [],
      query: "",
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
               default_calendary_slug: props.calendaries_cloud[0].slug,
               memories: props.memories.list,
               memoriesTotal: props.memories.total,
               memory: props.memory,
               query: {
                  c: MemoriesForm.getCalendariesString(props),
                  d: MemoriesForm.getDateString(props),
                  q: props.query,
                  p: props.memories.page,
               }
             }

         history.pushState({id: MemoriesForm.hashFromValue(state.query)},
                           'Днеслов',
                           MemoriesForm.getPathFromState(state))
         return state
      }

      return null
   }

   static getCalendariesString(props) {
      let c_a = props.calendaries_used && props.calendaries_used.slice()

      return c_a && c_a.join(",") || null
   }

   static getDateString(props) {
      return props.date && (props.measure == "юлианский" && "ю" || "н") + props.date || null
   }

   static parseCalendariesString(string) {
      return string && string.split(",") || null
   }

   static parseDateString(string) {
      if (string) {
         console.log(string)
         let r = string.match(/([юн])?([0-9\-\.]+)/)
         if (r) {
            return r.slice(2,3).reverse()
         }
      }

      return null
   }

   static getPathFromState(state) {
      let path = "/?" + Object.entries(state.query).reduce((line, [key, value]) => {
            console.log("[getPathFromState] >", "key:", key, "value:", value, "query:", line)
            if (value && value.length > 0) {
               let part = key + "=" + encodeURIComponent(value)
               return line && line + "&" + part || part
            } else {
               return line
            }
         }, undefined)

      return path
   }

   static hashFromValue(value) {
      let json = JSON.stringify(value),
          hash = crypto.createHash('sha1').update(json).digest('hex')

      console.log("[hashFromValue] > id:", hash)
      console.log("[hashFromValue] > json string:", json)
      sessionStorage.setItem(hash, json)

      return hash
   }

   updateState(state) {
      console.log("[updateState] <<< state", state)
      let hash = MemoriesForm.hashFromValue(state.query),
          path = MemoriesForm.getPathFromState(state)

      if (path === MemoriesForm.getPathFromState(this.state)) {
         console.log("[updateState] > stable")
         history.replaceState({id: hash}, document.title)
      } else {
         console.log("[updateState] > new")
         history.pushState({id: hash}, document.title, path)
      }

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
      return this.state.query.c && this.state.query.c.split(",").map((slug) => {
         return this.props.calendaries_cloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         }, null)
      })
   }

   onCloudAct(data) {
      let c = (this.state.query.c || "").split(",").filter(c => {
         c.length == 0
      }).concat([ data.slug ]).join(",")

      this.submit({c: c, p: 1})
   }

   onSearchAct(data) {
      let query = merge({}, this.state.query)
         console.log(data, query, query.q)

      if (data.date) {
         query.d = null
      } else if (data.slug) {
         let tokens = query.c.split(","),
             index = tokens.indexOf(data.slug)
         tokens.splice(index, 1)
         if (tokens.length == 0) {
            query.c = null
         } else {
            query.c = tokens.join(",")
         }
      } else if (data.token) {
         console.log(query.q)
         let tokens = query.q.split("/"),
             index = tokens.indexOf(data.token)

         console.log(tokens, index, tokens.splice(index, 1))
         query.q = tokens.splice(index, 1).join("/")
      }

      this.submit(merge(query, {p: 1}))
   }

   onSearchUpdate(query) {
      this.submit({q: query, p: 1})
   }

   onCalendarUpdate(value) {
      let d = (value['with_date'][1] == 'julian' && 'ю' || 'н') +  value['with_date'][0]

      this.submit({d: d, p: 1})
   }

   onFetchNext() {
      if (! this.isNextRequesting) {
         console.log("[onFetchNext] > getting...")
         this.isNextRequesting = true
         this.submit({p: this.state.query.p + 1})
      }
   }

   submit(query_in) {
      let query = merge(this.state.query, query_in)

      console.log("Sending...", query)

      let request = {
         data: query,
         url: '/index.json',
      }

      document.body.classList.add('in-progress')

      Axios.get(request.url, { params: request.data })
        .then(this.onMemoriesLoadSuccess.bind(this))
        .catch(this.onMemoriesLoadFailure.bind(this))
   }

   onMemoriesLoadSuccess(response) {
      console.log("[onMemoriesLoadSuccess] > response", response)

      let state, memories = response.data

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

      document.body.classList.remove('in-progress')
      this.updateState(merge(state, {query: response.config.params}))
      this.isNextRequesting = false
   }

   onMemoriesLoadFailure(response) {
      console.log("[onMemoriesLoadFailure] <<< response", response)

      document.body.classList.remove('in-progress')
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

      history.pushState({},
                        'Днесловъ – ' + memory.short_name,
                        '/' + memory.slug + '#' + this.state.default_calendary_slug)
      document.body.classList.remove('in-progress')
      this.updateState(state)
   }

   onPopState(e) {
      console.log("[onPopState] > session:", e.state)

      if (e.state) {
         this.state.query = JSON.parse(sessionStorage.getItem(e.state.id))
         this.submit(merge(this.state.query, {p: 1}))
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
                  <Intro />
                  <form>
                     <div className='col s12 m5 l3 xl2'>
                        <div className='hidden' id='calendary' />
                        <div className='row'>
                           <PickMeUpCalendar
                              onUpdate={this.onCalendarUpdate.bind(this)} />
                           <CalendariesCloud
                              calendaries={this.props.calendaries_cloud}
                              calendaries_used={this.calendariesUsed()}
                              onAct={this.onCloudAct.bind(this)} /></div></div>
                     <div className='col s12 m7 l9 xl10'>
                        {this.state.memory &&
                           <Memory
                              key='memory'
                              selected_calendaries={this.state.query.c}
                              {...this.state.memory} />}
                        {! this.state.memory &&
                           <div>
                              <div className='row'>
                                 <SearchField
                                    wrapperClassName='col xl12 l12 m12 s12'
                                    with_text={this.state.query.q}
                                    onUpdate={this.onSearchUpdate.bind(this)} /></div>
                              <SearchConditions
                                 date={MemoriesForm.parseDateString(this.state.query.d)}
                                 calendaries={this.calendariesUsed()}
                                 query={this.state.query.q || ""}
                                 onAct={this.onSearchAct.bind(this)} />
                              <MemorySpans
                                 memories={this.state.memories}
                                 total_memories={this.state.memoriesTotal}
                                 calendaries_cloud={MemoriesForm.parseCalendariesString(this.state.query.c)}
                                 default_calendary_slug={this.state.default_calendary_slug}
                                 onLoadRequest={this.onLoadRequest.bind(this)}
                                 onFetchNext={this.onFetchNext.bind(this)}/></div>}</div></form></div></div></main>])}}
