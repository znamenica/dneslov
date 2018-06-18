import { Component } from 'react'
import { CookiesProvider } from 'react-cookie'
import * as assign from 'assign-deep'
import * as Axios from 'axios'

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

   state = this.getDefaultState()

   // system
   componentDidMount() {
      window.onpopstate = this.onPopState.bind(this)
   }

   componentWillUnmount() {
      window.onpopstate = null
   }

   getDefaultState(props = this.props) {
      console.log(props)
      return {
         memories: this.props.memories.list,
         memoriesTotal: this.props.memories.total,
         memory: this.props.memory,
         query: {
            page: this.props.memories.page,
            with_date: [ this.props.date, this.props.julian ],
            in_calendaries: this.props.calendaries_used.slice(),
            with_tokens: this.props.tokens
         }
      }
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
      this.submit(this.state.query.page + 1)
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

      //let slugs = memories.list.map((m) => { return m.slug })
      //console.log("AJAX SUCCESS", slugs)
      console.log("LOADED", memories)

      if (memories.page > 1) {
         let newMemories = this.state.memories.concat(memories.list)
         state = assign({}, this.state, {
            memories: newMemories,
            memoriesTotal: memories.total,
            memory: null})
      } else {
         state = assign({}, this.state, {
            memories: memories.list,
            memoriesTotal: memories.total,
            memory: null})
      }

      history.pushState(state, 'Днесловъ', '/')
      document.body.classList.remove('in-progress')
      this.setState(state)
   }

   onMemoriesLoadFailure(response) {
      let query = assign(this.state.query, { in_calendaries: this.props.calendaries_used.slice() })
      document.body.classList.remove('in-progress')
      this.setState({query: query})
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
      let memory= response.data, state = assign({}, this.state, { memory: memory })

      console.log("Loaded memory", memory)

      history.pushState(state, 'Днесловъ – ' + memory.short_name, '/' + memory.slug)
      document.body.classList.remove('in-progress')
      this.setState(state)
   }

   onPopState(state) {
      console.log("oldstate", state)

      if (state.state && (state.state.memories || state.state.memory)) {
         this.setState(state.state)
      } else {
         this.setState(this.getDefaultState())
      }
   }

   render() {
      console.log("props", this.props)
      console.log("state", this.state)
      console.log("length", this.state.memories.length, "of total", this.state.memoriesTotal)

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
                                 onLoadRequest={this.onLoadRequest.bind(this)}
                                 onFetchNext={this.onFetchNext.bind(this)}/></div>}</div></form></div></div></main>])}}
