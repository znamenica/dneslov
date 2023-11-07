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
import Eventee from 'Eventee'
import Intro from 'Intro'
import Error from 'Error'
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
      error: null
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
               eventee: props.eventee,
               error: props.error,
               calendarySlug: props.calendaries_used?.length == 1 ? props.calendaries_used[0] : null,
               calendariesCloud: props.calendaries_cloud || [],
               query: {
                  c: getCalendariesString(props) || "",
                  d: getDateString(props),
                  q: props.query,
                  p: props.memories.page,
               }
             }

         document.title = getTitleFromState(state)
         let [ path, json_path ] = getPathsFromState(state)
         if (state.error) {
            history.replaceState({ query: state.query, path: document.location.href + '.json' }, document.title, document.location.href)
         } else {
            history.replaceState({ query: state.query, path: json_path }, document.title, path)
         }
         console.debug("[getDerivedStateFromProps] <<<", { toNewState: state })
         return state
      }

      return null
   }

   updateState(state) {
      console.debug("[updateState] <<<", { state: state })
      let [ path, json_path ] = getPathsFromState(state)

      console.log("[updateState] * replace with", path)
      document.title = getTitleFromState(state)
      if (state.error) {
         history.replaceState({ query: state.query, path: document.location.href + '.json' }, document.title, document.location.href)
      } else {
         history.replaceState({ query: state.query, path: json_path }, document.title, path)
      }

      console.debug("[getDerivedStateFromProps] <<<", { newState: state })
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
         return this.state.calendariesCloud.reduce((c, calendary) => {
            return c || calendary.slug == slug && calendary || null
         }, null)
      }).filter((x) => {return x})
   }

   defaultCalendarySlug() {
      return this.state.calendarySlug ||
             this.props.calendaries_used &&
             this.props.calendaries_used[0] ||
             this.state.calendariesCloud[0]?.slug
   }

   defaultUsedCalendary() {
      let calendaries = this.calendariesUsed()

      return calendaries && calendaries[0]
   }

   // handlers
   onCloudAct(data) {
      let c = this.state.query.c.split(",").filter(c => c).concat([ data.slug ]).join(",")

      console.debug("[onCloudAct] **", merge(this.state.query, {c: c, p: 1}))
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
      this.pushSubmit(merge(this.state.query, {q: query, p: 1, d: null}))
   }

   onCalendarUpdate(value) {
      let d = (value['withDate'][1] == 'julian' && 'ю' || 'н') +  value['withDate'][0]

      this.pushSubmit(merge(this.state.query, {d: d, p: 1}), '/index.json')
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
      console.debug("[onPopState] **", { e: e.state })

      if (e.state) {
         this.submit(e.state.query.merge({p: 1}), e.state.path)
      }
   }

   // remote data processing
   // query - new query
   // path - new path request
   pushSubmit(query, path) {
      console.debug("[pushSubmit] <<< ", { query: query, path: path })

      // storing current path and query
      let [ currentPath, jsonCurrentPath ] = getPathsFromState(merge(this.state, { query: query }))
      history.pushState({ query: this.state.query, path: jsonCurrentPath }, document.title, currentPath)

      // when path is undefined it is filled with current one
      path ||= jsonCurrentPath

      console.debug("[pushSubmit] **", this.state, query, path)
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
      console.debug("[onLoadSuccess] <<< response", response.data, response.data.total)

      if (response.data.list) {
         this.memoriesParse(response.data, response.config)
      } else if (response.data.events) {
         this.memoryParse(response.data, response.config)
      } else {
         this.eventParse(response.data, response.config)
      }
   }

   onLoadFailure(err) {
      console.debug("[onLoadFailure] <<< response", err.response)
      console.debug("[onLoadFailure] <<< response", err.config)

      if (err.response) {
         let state = merge(this.state, {
            memories: [],
            memory: null,
            eventee: null,
            error: {
               message: err.response.data.message,
               code: err.response.status
            }
         })
         document.body.classList.remove('in-progress')
         this.updateState(merge(state, {query: err.response.config.params}))
      }

      this.isNextRequesting = false
   }

   memoriesParse(memories, config) {
      let state

      if (memories.page > 1) {
         let newMemories = this.state.memories.concat(memories.list)
         state = merge(this.state, {
            memories: newMemories,
            memoriesTotal: memories.total,
            memory: null,
            eventee: null,
            error: null})
      } else {
         state = merge(this.state, {
            memories: memories.list,
            memoriesTotal: memories.total,
            memory: null,
            eventee: null,
            error: null})
      }

      document.body.classList.remove('in-progress')
      this.updateState(merge(state, {query: config.params}))
      this.isNextRequesting = false
   }

   memoryParse(memory, config) {
      let state = merge(this.state,
                        { memory: memory,
                          memories: [],
                          query: config.params,
                          eventee: null,
                          error: null})

      document.body.classList.remove('in-progress')
      this.updateState(state)
   }

   eventParse(eventee, config) {
      let state = merge(this.state,
                        { memory: null,
                          memories: [],
                          query: config.params,
                          eventee: eventee,
                          error: null})

      document.body.classList.remove('in-progress')
      this.updateState(state)
   }

   dateFromQuery() {
      let date = this.state.query.d || "",
          match = date.match(/\d{2}\.\d{2}\.\d{4}/)

      return match && match[0]
   }

   calendarStyleFromQuery() {
      let date = this.state.query.d || "",
          match = date.match(/ю/)

      if (match) {
         return 'julian'
      } else {
         return 'neojulian'
      }
   }

   render() {
      console.log("[render] * ", { props: this.props, state: this.state})
      console.log("[render] * ", )

      return (
         [<header>
            <nav className='terracota'>
               <div className="nav-wrapper">
                  <a
                     className='brand-logo'
                     href='/'
                     alt="Днеслов">
                     <img
                        src="/dneslov-title.png" /></a>
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
                     <div className='col s12 m4 l3 xl2'>
                        <div className='hidden' id='calendary' />
                        <div className='row'>
                           <PickMeUpCalendar
                              calendary={this.defaultUsedCalendary()}
                              withDate={this.dateFromQuery()}
                              calendarStyle={this.calendarStyleFromQuery()}
                              onUpdate={this.onCalendarUpdate.bind(this)} />
                           <CalendariesCloud
                              calendaries={this.state.calendariesCloud}
                              calendaries_used={this.calendariesUsed()}
                              onAct={this.onCloudAct.bind(this)} /></div></div>
                     <div className='col s12 m8 l9 xl10'>
                        {this.state.error &&
                           <Error
                              error={this.state.error} />}
                        {this.state.memory &&
                           <Memory
                              key='memory'
                              date={parseDateString(this.state.query.d).pop()}
                              calendarStyle={this.calendarStyleFromQuery()}
                              defaultCalendarySlug={this.defaultCalendarySlug()}
                              specifiedCalendarySlug={this.state.calendarySlug}
                              selectedCalendaries={this.state.query.c?.split(",")}
                              {...this.state.memory} />}
                        {this.state.eventee &&
                           <Eventee
                              key='eventee'
                              date={parseDateString(this.state.query.d).pop()}
                              calendarStyle={this.calendarStyleFromQuery()}
                              defaultCalendarySlug={this.defaultCalendarySlug()}
                              specifiedCalendarySlug={this.state.calendarySlug}
                              selectedCalendaries={this.state.query.c?.split(",")}
                              {...this.state.eventee} />}
                        {this.props.memories.list && !this.state.error && !this.state.eventee && !this.state.memory &&
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
