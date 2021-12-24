import { Component } from 'react'

import IconLoryModal from 'IconLoryModal'
import Image from 'Image'

export default class Carousel extends Component {
   static defaultProps = {
      images: [],
   }

   state = {}

   static getDerivedStateFromProps(props, state) {
      if (state.prevProps !== props) {
         return {
            loadCounter: 0,
            failCounter: 0,
            images: [],
            proceeded: false,
            prevProps: props }
      } else {
         return null
      }
   }

   // system
   constructor(props) {
      super(props)

      this.onIconClick = this.onIconClick.bind(this)
   }

   componentWillUnmount() {
      if (this.$carousel) {
         Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
            img.removeEventListener('click', this.onIconClick)
         })
      }
   }

   // events
   onIconClick(e) {
      if (e.target.className.match(/\bactive\b/)) {
         let index = e.target.getAttribute('data-index')

         this.$lory.openModal(index)

         e.stopPropagation()
      }
   }

   onLorySlideFrom(index) {
      if (index >= 0 && this.carousel) {
         this.carousel.set(index)
      }
   }

   shouldComponentUpdate() {
      console.debug("[shouldComponentUpdate] ** state", this.state)

      return this.state.proceeded
   }

   componentDidUpdate() {
      if (this.state.loadCounter > 0) {
         this.carousel = M.Carousel.init(this.$carousel, {});
         Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
            img.addEventListener('click', this.onIconClick, { passive: true })
         })
      }
   }

   stateChanged() {
      console.debug("[stateChanged] ** state", this.state)

      if (this.state.proceeded) {
         this.forceUpdate()
      }
   }

   onImageLoaded(index) {
      console.debug("[onImageLoaded] ** Image from url", this.props.images[index].url, "was loaded successfully")

      this.setState((prevState) => { return {
         loadCounter: prevState.loadCounter + 1,
         images: prevState.images.concat([this.props.images[index]]),
         proceeded: prevState.loadCounter + prevState.failCounter + 1 == this.props.images.length
      }}, this.stateChanged.bind(this))
   }

   onImageFailed(index) {
      console.error("[onImageLoaded] # Failed to load an image from url", this.props.images[index].url)

      this.setState((prevState) => { return {
         failCounter: prevState.failCounter + 1,
         proceeded: prevState.loadCounter + prevState.failCounter + 1 == this.props.images.length
      }}, this.stateChanged.bind(this))
   }

   carouselStyle() {
      return this.state.loadCounter > 0 && {} || { height: 0 }
   }

   images() {
      return this.state.proceeded && this.state.images || this.props.images
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
            <div className='col xl12 l12 m12 s12'>
               <div
                  key='carousel'
                  className='carousel compact'
                  style={this.carouselStyle()}
                  ref={e => this.$carousel = e} >
                  {this.images().map((image, index) =>
                     <Image
                        key={'image-' + image.id}
                        wrapperClassName='carousel-item'
                        alt={image.description}
                        src={image.url}
                        index={index}
                        onLoad={this.onImageLoaded.bind(this)}
                        onError={this.onImageFailed.bind(this)} />
                  )}</div>
               <IconLoryModal
                  key='lory'
                  ref={e => this.$lory = e}
                  onLorySlideFrom={this.onLorySlideFrom.bind(this)}
                  links={this.state.images} /></div>)}}
