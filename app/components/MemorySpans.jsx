import { Component } from 'react'
import ReactScrollPagination from '@majioa/react-scroll-pagination'

import MemorySpan from 'MemorySpan'

export default class MemorySpans extends Component {
   static defaultProps = {
      memories: [],
      totalMemories: 0,
      calendariesCloud: null,
      defaultCalendarySlug: null,
      onFetchNext: null,
      onLoadRequest: null,
   }

   // system
   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {})
   }

   componentWillUnmount() {
      this.collapsible?.destroy()
   }

   // props
   fetchNext() {
      if (this.props.totalMemories > this.props.memories.length) {
         return this.props.onFetchNext()
      }
   }

   isPresent() {
      return this.props.memories.length > 0
   }

   calendarySlugs() {
      return this.props.calendariesCloud || [ this.props.defaultCalendarySlug ]
   }

   descriptionFirst(memory) {
      return this.calendarySlugs().reduce((text, slug) => {
         return text || memory.descriptions.reduce((desc, description) => {
            return desc || description.calendary && description.calendary.slug == slug && description.text || null
         }, null)
      }, null)
   }

   calculateDefaultCalendaryIn(array) {
      return this.calendarySlugs().reduce((cal, calendarySlug) => {
         if (cal) {
            return cal
         } else {
            return array.reduce((cal, value) => {
               if (!cal && value.calendary == calendarySlug) {
                  return calendarySlug
               } else {
                  return cal
               }
            }, null)
         }
      }, null)
   }

   titleFirst(memory) {
      var cal = this.calculateDefaultCalendaryIn(memory.titles),
          title = memory.titles.find((title) => { return title.calendary == cal })

      return memory.default_name_in_calendary || title.text
   }

   render() {
      console.log("[render] > props:", this.props)

      return (
         <div className='row'
            id='memories-list'>
            {this.isPresent() &&
               <ul
                  key='span-list'
                  ref={e => this.$collapsible = e}
                  className='collapsible collection'
                  data-collapsible='expandable' >
                  {this.props.memories.map((memory) =>
                     <MemorySpan
                        key={memory.slug}
                        slug={memory.slug}
                        title={memory.title}
                        defaultCalendarySlug={this.props.defaultCalendarySlug}
                        url={memory.url}
                        thumbUrl={memory.thumb_url}
                        happenedAt={memory.happened_at}
                        orders={memory.orders}
                        description={memory.description}
                        addDate={memory.add_date}
                        yearDate={memory.year_date}
                        happenedAt={memory.happened_at}
                        bindKindCode={memory.bind_kind_code}
                        calendarySlug={memory.calendary_slug}
                        eventTitle={memory.event_title}
                        onLoadRequest={this.props.onLoadRequest} />)}
                  <ReactScrollPagination
                     excludeElement='header'
                     total={this.props.totalMemories}
                     loadedTotal={this.props.memories.length}
                     fetchFunc={this.fetchNext.bind(this)} /></ul>}
            {!this.isPresent() &&
               <div className='card-panel'>
                  <p className='flow-text'>Ничегошеньки не нашлось</p></div>}</div>)}}
