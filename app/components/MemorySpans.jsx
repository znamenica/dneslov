import { Component } from 'react'
import ReactScrollPagination from '@majioa/react-scroll-pagination'

import MemorySpan from 'MemorySpan'

export default class MemorySpans extends Component {
   static defaultProps = {
      memories: [],
      total_memories: 0,
      calendaries_cloud: null,
      default_calendary_slug: null,
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
      if (this.props.total_memories > this.props.memories.length) {
         this.props.onFetchNext()
      }
   }

   isPresent() {
      return this.props.memories.length > 0
   }

   calendary_slugs() {
      return this.props.calendaries_cloud || [ this.props.default_calendary_slug ]
   }

   descriptionFirst(memory) {
      return this.calendary_slugs().reduce((text, slug) => {
         return text || memory.descriptions.reduce((desc, description) => {
            return desc || description.calendary && description.calendary.slug == slug && description.text || null
         }, null)
      }, null)
   }

   calculateDefaultCalendaryIn(array) {
      return this.calendary_slugs().reduce((cal, calendary_slug) => {
         if (cal) {
            return cal
         } else {
            return array.reduce((cal, value) => {
               if (!cal && value.calendary == calendary_slug) {
                  return calendary_slug
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
                        default_calendary_slug={this.props.default_calendary_slug}
                        url={memory.url}
                        thumb_url={memory.thumb_url}
                        happened_at={memory.happened_at}
                        orders={memory.orders}
                        description={memory.description}
                        add_date={memory.add_date}
                        year_date={memory.year_date}
                        happened_at={memory.happened_at}
                        bind_kind_code={memory.bind_kind_code}
                        calendary_slug={memory.calendary_slug}
                        event_title={memory.event_title}
                        onLoadRequest={this.props.onLoadRequest} />)}
                  <ReactScrollPagination
                     excludeElement='header'
                     totalPages={this.props.total_memories}
                     fetchFunc={this.fetchNext.bind(this)} /></ul>}
            {!this.isPresent() &&
               <div className='card-panel'>
                  <p className='flow-text'>Ничегошеньки не нашлось</p></div>}</div>)}}
