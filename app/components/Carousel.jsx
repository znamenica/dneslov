import { Component } from 'react'

import IconLoryModal from 'IconLoryModal'

export default class Carousel extends Component {
   static defaultProps = {
      images: [],
   }

   state = {}

   static getDerivedStateFromProps(props, state) {
      if (state.prevProps !== props) {
         return { loadCounter: 0, prevProps: props }
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

   onLorySlideFrom(e) {
      let index = parseInt(e.detail.currentSlide)

      if (index >= 0 && this.carousel) {
         this.carousel.set(e.detail.currentSlide)
      }
   }

   stateChanged() {
         console.log("LOADED", this.state.loadCounter)
      if (this.state.loadCounter == this.props.images.length) {
         console.log("CAROUSEL COMPLETED")
         this.carousel = M.Carousel.init(this.$carousel, {});
         Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
            console.log("CAROUSEL", img)
            img.addEventListener('click', this.onIconClick, { passive: true })
         })
      }
   }

   onImageCompleted(e) {
      this.setState((prevState) => { return { loadCounter: prevState.loadCounter + 1 }}, this.stateChanged.bind(this))
   }

   render() {
      console.log("CARU", this.props)

      return (
         <div className='col xl12 l12 m12 s12'>
            <div
               key='carousel'
               className='carousel compact'
               ref={e => this.$carousel = e} >
               {this.props.images.map((image) =>
                  <img
                     key={image.id}
                     className='carousel-item'
                     alt={image.description}
                     src={image.url}
                     data-index={image.id}
                     onLoad={this.onImageCompleted.bind(this)}
                     onError={this.onImageCompleted.bind(this)} />)}</div>
            <IconLoryModal
               key='lory'
               ref={e => this.$lory = e}
               onLorySlideFrom={this.onLorySlideFrom.bind(this)}
               links={this.props.images} /></div>)}}
