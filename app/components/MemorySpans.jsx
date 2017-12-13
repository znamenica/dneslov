import { Component } from 'react'
import ReactScrollPagination from 'react-scroll-pagination/src/index'

import MemorySpan from 'MemorySpan'

export default class MemorySpans extends Component {
   static defaultProps = {
      memories: [],
      total_memories: 0,
      onFetchNext: null
   }

   fetchNext() {
      if (this.props.total_memories > this.props.memories.length && ! this.isRequesting) {
         console.log("SPANS", this.props)
         this.isRequesting = true
         this.props.onFetchNext()
      }
   }

   componentDidMount() {
      $(this.$collapsible).collapsible()
   }

   componentDidUpdate(nextProps) {
      let slugs = this.props.memories.map((m) => { return m.slug } )
      $(this.$collapsible).collapsible()

      console.log("memories", this.props.memories.length)
      console.log("memories total", this.props.total_memories)
      console.log("slugs", slugs)
      this.isRequesting = false
   }

   render() {
      let rendered

      if (this.props.memories.length > 0) {
         rendered = (
            <ul
               ref={$collapsible => this.$collapsible = $collapsible}
               className='collapsible collection'
               data-collapsible='expandable'>
               {this.props.memories.map((memory) =>
                  <MemorySpan key={memory.slug} memory={memory} />)}
               <ReactScrollPagination
                  fetchFunc={this.fetchNext.bind(this)} /></ul>)
      } else {
         rendered = (
            <div className='card-panel'>
               <p className='flow-text'>Ничегошеньки не нашлось</p></div>)
      }

      return (
         <div className='row'
            id='memories-list'>
            {rendered}</div>)}}
