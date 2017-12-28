import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import MemorySpan from 'MemorySpan'

export default class MemorySpans extends Component {
   static defaultProps = {
      memories: [],
      total_memories: 0,
      onFetchNext: null,
      onLoadRequest: null,
   }

   // system
   componentDidMount() {
      $(this.$collapsible).collapsible()
   }

   // props
   fetchNext() {
      if (this.props.total_memories > this.props.memories.length && ! this.isRequesting) {
         console.log("SPANS", this.props)
         this.isRequesting = true
         this.props.onFetchNext()
      }
   }

   isPresent() {
      return this.props.memories.length > 0
   }

   render() {
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
                        description={memory.description}
                        names={memory.names}
                        onLoadRequest={this.props.onLoadRequest} />)}
                  <ReactScrollPagination
                     fetchFunc={this.fetchNext.bind(this)} /></ul>}
            {!this.isPresent() &&
               <div className='card-panel'>
                  <p className='flow-text'>Ничегошеньки не нашлось</p></div>}</div>)}}
