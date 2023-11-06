import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import PropTypes from 'prop-types'

import Carousel from 'Carousel'
import Chip from 'Chip'
import Name from 'Name'
import Description from 'Description'
import GetSlugColor from 'mixins/GetSlugColor'
import Markdown from 'Markdown'
import MetaTags from 'react-meta-tags'
import { getUrlsFrom } from 'support'

@mixin(GetSlugColor)
export default class Eventee extends Component {
   static defaultProps = {
      happened_at: null,
      memory: null,
      title: null,
      place: {},
      titles: [],
      scripta: [],
      memoes: [],
      links: [],
      describedMemoIds: [],

      active: null,
      defaultCalendarySlug: null,
      specifiedCalendarySlug: null,
      wrapperYearDateClass: "",
      selectedCalendaries: [],
      calendarStyle: 'julian'
   }

   static propTypes = {
      happened_at: PropTypes.string.isRequired,
      defaultCalendarySlug: PropTypes.string,
      specifiedCalendarySlug: PropTypes.string,
      memory: PropTypes.object.isRequired,
      specific_title: PropTypes.string,
      title: PropTypes.string,
      place: PropTypes.object.isRequired,
      titles: PropTypes.array.isRequired,
      scripta: PropTypes.array.isRequired,
      memoes: PropTypes.array.isRequired,
      links: PropTypes.array.isRequired,
      describedMemoIds: PropTypes.array,
      date: PropTypes.string.isRequired,

      active: PropTypes.string,
      wrapperYearDateClass: PropTypes.string,
      selectedCalendaries: PropTypes.array,
      calendarStyle: PropTypes.string,
   }

   static types = ["Subject", "Event"]

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         //let memo = Eventee.getMemo(props)

         return {
            prevProps: props,
            title: Eventee.getTitle(props),
            describedMemoes: Eventee.getDescribedMemoes(props),
            order: Eventee.getOrder(props),
            //msDate: Event.getMsDate(props),
            //klugs: Event.collectKlugs(props),
            //describedMemoIds: Memory.getDescribedMemoIds(describedMemoes),
            links: Eventee.getLinks(props),
            iconLinks: Eventee.getIconLinks(props),
            scripta: Eventee.selectScripta(props),
            //happenedAt: Event.getHappenedAt(props)
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

   static getLinks(props) {
      let links = [ "WikiLink", "BeingLink", "PatericLink" ].map((type) => {
         return props.links.selectByKey("type", type)
      }).flat()

      return links
   }

   static getIconLinks(props) {
      return props.links.selectByKey("type", "IconLink")
   }

   static getMemo(props) {
      let titles = props.memoes.sort((x, y) => {
         return x.calendary_slug == props.defaultCalendarySlug ? -1 : 0
      })

      return titles[0]
   }

   static selectScripta(props) {
      return props.scripta.filter(c => { return c.text })
   }

   static getTitle(props) {
      let titles = props.titles.sortByArray(this.types, "type")

      return titles[0]?.text
   }

   static isInCalendaries(props, memo) {
      let selected = props.selectedCalendaries.filter(calendarySlug => {
         return memo.calendary_slug == calendarySlug
      })

      return selected.length > 0
   }

   static getOrder(props) {
      return props.memoes.reduce((order, m) => {
         return order || this.isInCalendaries(props, m) && Object.values(m.orders)[0]
      }, null) || props.order
   }

   // system
   state = {}

   constructor(props) {
      super(props)

      this.onSpanHeaderClick = this.onSpanHeaderClick.bind(this)
   }

   componentDidMount() {
      //this.$header.addEventListener('click', this.onSpanHeaderClick)
   }

   componentWillUnmount() {
      //this.$header.removeEventListener('click', this.onSpanHeaderClick)
   }

   // custom
   hasData() {
      return this.props.scripta.length > 0 || this.hasDescription()
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

   getDescription() {
      return this.props.short_name + " " +
             this.props.names.reduce((res, x) => { return res + " " + x.name_text }, "") +
             this.props.titles.reduce((res, x) => { return res + " " + x.text }, "")
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <div className='row'>
            <MetaTags>
               <meta id="meta-description" name="description" content={this.getDescription()} />
            </MetaTags>
            <div className='col s12'>
               {! this.props.specific_title && [
                  <Chip
                     color={this.getSlugColor(this.props.order || this.props.memory?.order)}
                     text={this.state.order} />,
                  <Name
                     short_name={this.props.memory?.short_name}
                     url={getUrlsFrom(this.props.specifiedCalendarySlug, this.props.memory)[0]}
                     names={this.props.names} />,
                  <Chip
                     color={this.getSlugColor(this.state.title)}
                     text={this.state.title} />,]}
               {this.props.specific_title &&
                  <span>
                     {this.props.specific_title}</span>}
               {this.props.place?.name &&
                  <Chip
                     className='place'
                     text={this.props.place.name} />}
               {this.props.happened_at && <Chip
                  text={this.props.happened_at} />}</div>
            {this.props.date && false && <Chip
               cclassName={this.classNameForYearDate()}
               text={this.props.date} />}
            {this.state.iconLinks.isPresent() &&
               <Carousel
                  images={this.state.iconLinks} />}
            {this.props.memoes.isPresent() &&
               <Description
                  describedMemoes={this.props.memoes}
                  specifiedCalendarySlug={this.props.specifiedCalendarySlug}
                  defaultCalendarySlug={this.props.defaultCalendarySlug} />}
            {this.state.links.isPresent() &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Внешние ссылки</div>
                     <div className='col s12'>
                        {this.state.links.map((link) =>
                           <Chip
                              key={link.id}
                              url={link.url}
                              color={Memory.getColorForLink(link)}
                              text={Memory.getLinkText(link)} />)}</div></div></div>}
            {this.state.scripta.isPresent() &&
               <div className='col s12'>
                  {this.sortedScripta().map((scriptum) =>
                     <div className='row'>
                        <div className='col s12 title'>
                           {this.getScriptumTitle(scriptum)}</div>
                        <div className='col s12'>
                           {scriptum.text}</div></div>)}</div>}</div>)
   }
}
