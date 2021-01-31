import { Component } from 'react'
import ReactMarkdown from 'react-markdown'

import Chip from 'Chip'

export default class EventSpan extends Component {
   static defaultProps = {
      happenedAt: null,
      kindName: null,
      place: {},
      titles: [],
      cantoes: [],
      memoes: [],
      defaultCalendarySlug: null,
      describedMemoIds: [],

      active: null,
      wrapperYearDateClass: "",
   }

   static types = [ "Subject", "Event" ]

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         let memo = EventSpan.getMemo(props)

         return {
            prevProps: props,
            yearDate: memo ? memo.yd_parsed : null,
            title: EventSpan.getTitle(props),
            describedMemoes: EventSpan.getDescribedMemoes(props),
         }
      }

      return null
   }

   static getDescribedMemoes(props) {
      let dMs = props.memoes.filter((m) => {
         return m.description && !props.describedMemoIds.includes(m.id)
      })

      return dMs
   }

   static getMemo(props) {
      let titles = props.memoes.sort((x, y) => {
         return x.calendary_slug == props.defaultCalendarySlug ? -1 : 0
      })

      return titles[0]
   }

   static getTitle(props) {
      let titles = props.titles.sortByArray(this.types, "type")

      return titles[0].text
   }

   // system
   state = {}

   constructor(props) {
      super(props)

      this.onSpanHeaderClick = this.onSpanHeaderClick.bind(this)
   }

   componentDidMount() {
      this.$header.addEventListener('click', this.onSpanHeaderClick)
   }

   componentWillUnmount() {
      this.$header.removeEventListener('click', this.onSpanHeaderClick)
   }

   // custom
   hasData() {
      return this.props.cantoes.length > 0 || this.hasDescription()
   }

   classNameForItem() {
      return 'collection-item event ' + (this.props.active && "active" || "")
   }

   classNameForYearDate() {
      return 'year-date right ' + (this.props.active && "nearby" || "")
   }

   hasDescription() {
      let memo = this.state.describedMemoes[0]

      return memo && memo.description
   }

   onSpanHeaderClick(e) {
      if (!this.hasData()) {
         e.preventDefault()
         e.stopPropagation()
      }
   }

   render() {
      console.log("[render] * this.props", this.props)

      return (
         <li className={this.classNameForItem()}>
            <div
               className='collapsible-header'
               key={'event-span-' + this.state.yearDate + '-' + this.props.happenedAt}
               ref={e => this.$header = e} >
               <span>
                  {this.state.title}</span>
               <Chip
                  className='happened-at'
                  text={this.props.happenedAt} />
               {this.props.place &&
                  <Chip
                     className='place'
                     text={this.props.place.name} />}
               {this.state.yearDate && <Chip
                  className={this.classNameForYearDate()}
                  text={this.state.yearDate} />}</div>
            {this.hasData() &&
               <div className='collapsible-body'>
                  <div className="container">
                  {this.hasDescription() &&
                        <div className='row'>
                           <div className='col s12 description'>
                              <ReactMarkdown source={this.state.describedMemoes[0].description} /></div></div>}
               {this.props.cantoes > 0 &&
                  <div className='col s12'>
                     {this.props.cantoes.map((canto) =>
                        <div className='row'>
                           <div className='col s12 title'>
                              {canto.title}</div>
                           <div className='col s12'>
                              {canto.text}</div></div>)}</div>}</div></div>}</li>)
   }
}
