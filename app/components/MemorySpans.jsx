import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import MemorySpan from 'MemorySpan'

export default class MemorySpans extends Component {
   static defaultProps = {
      memories: [],
      total_memories: 0,
      calendaries_cloud: [],
      onFetchNext: null,
      onLoadRequest: null,
   }

   // system
   componentDidMount() {
      M.Collapsible.init(this.$collapsible, {})
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

   descriptionFirst(memory) {
      return this.props.calendaries_cloud.reduce((text, slug) => {
         return text || memory.descriptions.reduce((desc, description) => {
            return desc || description.calendary && description.calendary.slug == slug && description.text || null
         }, null)
      }, null)
   }

   render() {
      console.log("memorie spans", this.props)

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
                        short_name={memory.short_name}
                        default_calendary_name={memory.default_calendary_name}
                        url={memory.url}
                        icon_url={memory.icon_url}
                        year={memory.year}
                        order={memory.order}
                        description={this.descriptionFirst(memory)}
                        names={memory.names}
                        onLoadRequest={this.props.onLoadRequest} />)}
                  <ReactScrollPagination
                     fetchFunc={this.fetchNext.bind(this)} /></ul>}
            {!this.isPresent() &&
               <div className='card-panel'>
                  <p className='flow-text'>Ничегошеньки не нашлось</p></div>}</div>)}}
