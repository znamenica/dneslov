import { Component } from 'react'
import { CookiesProvider } from 'react-cookie'
import { merge } from 'merge-anything'
import * as Axios from 'axios'

import PickMeUpCalendar from 'PickMeUpCalendar'
import CalendariesCloud from 'CalendariesCloud'
import SearchField from 'SearchField'
import SearchConditions from 'SearchConditions'
import MemorySpans from 'MemorySpans'
import Memory from 'Memory'
import Intro from 'Intro'
import { getCalendariesString, getDateString, getPathsFromState, getTitleFromState, parseDateString, parseCalendariesString } from 'support'

export default class MemoriesForm extends Component {
   static defaultProps = {
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
      console.debug("[getDerivedStateFromProps] <<<", { props: props, state: state })

      if (props !== state.prevProps) {
         let state = {
               prevProps: props,
               memories: props.memories.list,
               memoriesTotal: props.memories.total,
               memory: props.memory,
               query: {
                  c: getCalendariesString(props),
                  d: getDateString(props),
                  q: props.query,
                  p: props.memories.page,
               }
             }

         document.title = getTitleFromState(state)
         let [ path, json_path ] = getPathsFromState(state)
         history.replaceState({ query: state.query, path: json_path }, document.title, path)
         return state
      }

      return null
   }

   updateState(state) {
      console.debug("[updateState] <<<", { state: state })
      let [ path, json_path ] = getPathsFromState(state)

      console.log("[updateState] * replace with", path)
      document.title = getTitleFromState(state)
      history.replaceState({ query: state.query, path: json_path }, document.title, path)

      this.setState(state)
   }

   componentDidMount() {
      window.onpopstate = this.onPopState.bind(this)
   }

   componentWillUnmount() {
      window.onpopstate = null
   }

   // props
   calendariesUsed() {
      return this.state.query.c && this.state.query.c.split(",").map((slug) => {
         return this.props.calendaries_cloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         }, null)
      }).filter((x) => {return x})
   }

   defaultCalendarySlug() {
      return this.props.calendaries_used &&
             this.props.calendaries_used[0] ||
             this.props.calendaries_cloud[0].slug
   }

   // handlers
   onCloudAct(data) {
      let c = (this.state.query.c || "").split(",").filter(c => c).concat([ data.slug ]).join(",")

      this.pushSubmit(merge(this.state.query, {c: c, p: 1}))
   }

   onSearchAct(data) {
      let query = merge({}, this.state.query)

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
         console.debug("[onSearchAct] **", {q: query.q})
         let tokens = query.q.split("/"),
             index = tokens.indexOf(data.token)

         console.debug("[onSearchAct] **", tokens, index, tokens.splice(index, 1))
         query.q = tokens.splice(index, 1).join("/")
      }

      this.pushSubmit(merge(query, {p: 1}))
   }

   onSearchUpdate(query) {
      this.pushSubmit(merge(this.state.query, {q: query, p: 1}))
   }

   onCalendarUpdate(value) {
      let d = (value['withDate'][1] == 'julian' && 'ю' || 'н') +  value['withDate'][0]

      this.pushSubmit(merge(this.state.query, {d: d, p: 1}))
   }

   onFetchNext() {
      if (! this.isNextRequesting) {
         console.log("[onFetchNext] * getting...")
         this.isNextRequesting = true
         this.submit(merge(this.state.query, {p: this.state.query.p + 1}))
      }
   }

   onMemoryLoadRequest(slug) {
      let url = '/' + slug + '.json',
          data = { c: this.state.query.c, d: this.state.query.d }

      this.pushSubmit(data, url)
   }

   onPopState(e) {
      console.debug("[onPopState] <<<", { e: e })

      if (e.state) {
         this.submit(e.state.query, e.state.path)
      }
   }

   // remote data processing
   pushSubmit(query, path) {
      console.debug("[pushSubmit] <<< ", { query: query, path: path })
      let [ cpath, json_cpath ] = getPathsFromState(this.state)
      history.pushState({ query: this.state.query, path: json_cpath }, document.title, cpath)

      this.submit(query, path)
   }

   submit(query, path) {
      console.debug("[submit] <<< ", { query: query, path: path })

      let url = path || '/index.json',
          request = {
            data: query,
            url: url,
          }

      document.body.classList.add('in-progress')
      Axios.get(request.url, { params: request.data })
        .then(this.onLoadSuccess.bind(this))
        .catch(this.onLoadFailure.bind(this))
   }

   onLoadSuccess(response) {
      console.debug("[onLoadSuccess] <<< response", response)

      if (response.config.url.match(/index.json/)) {
         this.memoriesParse(response.data, response.config)
      } else {
         this.memoryParse(response.data, response.config)
      }
   }

   onLoadFailure(response) {
      console.debug("[onLoadFailure] <<< response", response)

      history.go(1)
      document.body.classList.remove('in-progress')
      this.isNextRequesting = false
   }

   memoriesParse(memories, config) {
      let state

      if (memories.page > 1) {
         let newMemories = this.state.memories.concat(memories.list)
         state = merge(this.state, {
            memories: newMemories,
            memoriesTotal: memories.total,
            memory: null})
      } else {
         state = merge(this.state, {
            memories: memories.list,
            memoriesTotal: memories.total,
            memory: null})
      }

      document.body.classList.remove('in-progress')
      this.updateState(merge(state, {query: config.params}))
      this.isNextRequesting = false
   }

   memoryParse(memory, config) {
      let state = merge(this.state,
                        { memory: memory,
                          memories: null,
                          query: config.params })

      document.body.classList.remove('in-progress')
      this.updateState(state)
   }

   dateFromQuery() {
      return this.state.query.d.match(/\d{2}\.\d{2}\.\d{4}/)[0]
   }

   calendarStyleFromQuery() {
      if (this.state.query.d.match(/ю/)) {
         return 'julian'
      } else {
         return 'neojulian'
      }
   }

   render() {
      console.log("[render] * ", { props: this.props, state: this.state})

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
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                     <li>
                        <a
                           href={"/about"}>
                           {"О проекте..."}</a></li>
                     <div className='moon btn-floating btn-large'>
                        <i
                           className="material-icons">
                           brightness_4</i></div></ul></div></nav></header>,
         <main>
            <div className='container'>
               <div className='row'>
                  <Intro />
                  <form>
                     <div className='col s12 m5 l3 xl2'>
                        <div className='hidden' id='calendary' />
                        <div className='row'>
                           <PickMeUpCalendar
                              calendary={this.calendariesUsed()[0]}
                              withDate={this.dateFromQuery()}
                              calendarStyle={this.calendarStyleFromQuery()}
                              onUpdate={this.onCalendarUpdate.bind(this)} />
                           <CalendariesCloud
                              calendaries={this.props.calendaries_cloud}
                              calendaries_used={this.calendariesUsed()}
                              onAct={this.onCloudAct.bind(this)} /></div></div>
                     <div className='col s12 m7 l9 xl10'>
                        {this.state.memory &&
                           <Memory
                              key='memory'
                              date={parseDateString(this.state.query.d).pop()}
                              default_calendary_slug={this.defaultCalendarySlug()}
                              selected_calendaries={this.state.query.c?.split(",")}
                              {...this.state.memory} />}
                        {! this.state.memory &&
                           <div>
                              <div className='row'>
                                 <SearchField
                                    wrapperClassName='col xl12 l12 m12 s12'
                                    with_text={this.state.query.q}
                                    onUpdate={this.onSearchUpdate.bind(this)} /></div>
                              <SearchConditions
                                 date={parseDateString(this.state.query.d).pop()}
                                 calendaries={this.calendariesUsed()}
                                 query={this.state.query.q || ""}
                                 onAct={this.onSearchAct.bind(this)} />
                              <MemorySpans
                                 memories={this.state.memories}
                                 totalMemories={this.state.memoriesTotal}
                                 calendariesCloud={parseCalendariesString(this.state.query.c)}
                                 defaultCalendarySlug={this.defaultCalendarySlug()}
                                 onLoadRequest={this.onMemoryLoadRequest.bind(this)}
                                 onFetchNext={this.onFetchNext.bind(this)}/></div>}</div></form></div></div></main>,
         <div className="progress">
            <div className="indeterminate"></div></div> ])
   }
}
