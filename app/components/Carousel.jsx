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

   onLorySlideFrom(index) {
      if (index >= 0 && this.carousel) {
         this.carousel.set(index)
      }
   }

   shouldComponentUpdate() {
      return false
   }

   componentDidUpdate() {
      this.carousel = M.Carousel.init(this.$carousel, {});
      Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
         img.addEventListener('click', this.onIconClick, { passive: true })
      })
   }

   stateChanged() {
      if (this.state.loadCounter == this.props.images.length) {
         this.forceUpdate()
      }
   }

   onImageCompleted(_index) {
      this.setState((prevState) => { return { loadCounter: prevState.loadCounter + 1 }}, this.stateChanged.bind(this))
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <div className='col xl12 l12 m12 s12'>
            <div
               key='carousel'
               className='carousel compact'
               ref={e => this.$carousel = e} >
               {this.props.images.map((image, index) =>
                  <Image
                     key={'image-' + image.id}
                     wrapperClassName='carousel-item'
                     alt={image.description}
                     src={image.url}
                     index={index}
                     onLoad={this.onImageCompleted.bind(this)}
                     onError={this.onImageCompleted.bind(this)} />
               )}</div>
            <IconLoryModal
               key='lory'
               ref={e => this.$lory = e}
               onLorySlideFrom={this.onLorySlideFrom.bind(this)}
               links={this.props.images} /></div>)}}
