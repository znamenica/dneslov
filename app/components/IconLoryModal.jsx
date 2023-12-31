import { Component } from 'react'
import { lory } from 'lory.js'

import PureImage from 'PureImage'

export default class IconLoryModal extends Component {
   static defaultProps = {
      links: [],
      onLorySlideFrom: null,
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

      this.currentImgIndex = 0
      this.leftOffset = 0
      this.loryResize = this.loryResize.bind(this)
      this.onDocumentClick = this.onDocumentClick.bind(this)
   }

   componentDidMount() {
      this.$lory.addEventListener('after.lory.init', this.loryResize, { passive: true })
      this.$lory.addEventListener('on.lory.resize', this.loryResize, { passive: true })
      document.addEventListener('click', this.onDocumentClick, { passive: true })

   }

   componentWillUnmount() {
      this.$lory.removeEventListener('after.lory.init', this.loryResize)
      this.$lory.removeEventListener('on.lory.resize', this.loryResize)
      document.removeEventListener('click', this.onDocumentClick)
   }

   // events
   stateChanged() {
      this.componentReady()
   }

   componentReady() {
      console.debug("[componentReady] <<<")
      this.modal = M.Modal.init(this.$modal, {})
      console.log("[componentReady] **", this.modal)
      this.lory = lory(this.$lory, {
         slideSpeed: 750,
         enableMouseEvents: true,
         ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
         rewind: true,
      })
   }

   loryResize(a,e) {
      this.imagePaneWidth = this.getImagePaneWidth()
      this.checkPrevNextState()
   }

   openModal(index) {
      console.debug("[openModal] ** open")
      this.modal.open()
      this.imagePaneWidth = this.getImagePaneWidth()
      this.rollTo(index)
   }

   onDocumentClick(e) {
      // TODO click to transparent area of the modal, get fired to the modal, not the
      // page. Fix it then.
      if (! e.cancelBubble && this.isOpen() && ! e.target.closest('.modal')) {
         this.modal.close()
      }
   }

   onImageCompleted() {
      this.setState((prevState) => { return { loadCounter: prevState.loadCounter + 1 }}, this.stateChanged.bind(this))
   }

   // props
   rollTo(index) {
      let lis = [...this.$ul.querySelectorAll('li')],
          width = this.$lory.clientWidth

      this.leftOffset = Math.min(lis[index].offsetLeft, this.imagePaneWidth - width)
      console.debug("[rollTo]", width, - this.leftOffset + 'px')

      this.$ul.style.left = - this.leftOffset + 'px'
      this.checkPrevNextState()
   }

   isOpen() {
      return this.$modal && this.$modal.classList.contains('open')
   }

   getItemBounds() {
      let sum = 0

      this._itemBounds ||= [ 0, ...[...this.$ul.querySelectorAll('li')].map((li) => {
         sum = sum +
               li.clientWidth +
               parseInt(getComputedStyle(li).marginLeft) +
               parseInt(getComputedStyle(li).marginRight)

         return sum
      }) ]

      return this._itemBounds
   }

   onPrevClick() {
      let lis = [...this.$ul.querySelectorAll('li')],
          itemBounds = this.getItemBounds(),
          width = this.$lory.clientWidth,
          proposeLeftOffset = this.leftOffset - width,
          leftPos = itemBounds.reduce((res, leftPos) => {
            return res !== null ? res :
                  (leftPos > proposeLeftOffset) ?
                   leftPos : null
          }, null)

      console.debug("[prev]", itemBounds, proposeLeftOffset, this.$ul.offsetLeft, width, leftPos, - this.leftOffset + 'px')
      this.leftOffset = lis[itemBounds.indexOf(leftPos)].offsetLeft
      this.props.onLorySlideFrom(itemBounds.indexOf(leftPos))

      this.$ul.style.left = - this.leftOffset + 'px'
      this.checkPrevNextState()
   }

   onNextClick() {
      let sum = 0,
          lis = [...this.$ul.querySelectorAll('li')],
          itemBounds = this.getItemBounds(),
          width = this.$lory.clientWidth,
          rightPos = itemBounds.reduce((res, rightPos) => {
            return res !== null ? res :
                  (rightPos > width - this.$ul.offsetLeft) ?
                   rightPos : null
          }, null)

      this.leftOffset = Math.min(lis[itemBounds.indexOf(rightPos) - 1].offsetLeft,
                                 itemBounds.reduceRight(a => a) - width)
      this.props.onLorySlideFrom(itemBounds.indexOf(rightPos) - 1)
      console.debug("[next]", this.$ul.offsetLeft, width, rightPos, - this.leftOffset + 'px')

      this.$ul.style.left = - this.leftOffset + 'px'
      this.checkPrevNextState()
   }

   checkPrevNextState() {
      if (this.isAtLeftBorder()) {
         this.$prev.classList.add('hidden')
      } else {
         this.$prev.classList.remove('hidden')
      }

      if (this.isAtRightBorder()) {
         this.$next.classList.add('hidden')
      } else {
         this.$next.classList.remove('hidden')
      }
   }

   getImagePaneWidth() {
      return [...this.$ul.querySelectorAll('li')].reduce((width, li) => {
         return width +
                li.clientWidth +
                parseInt(getComputedStyle(li).marginLeft) +
                parseInt(getComputedStyle(li).marginRight)
      }, 0)
   }

   isAtLeftBorder() {
      console.debug("[isAtLeftBorder] **" , this.$ul.offsetLeft, this.leftOffset, this.imagePaneWidth, - this.$ul.offsetLeft + this.$lory.clientWidth, this.leftOffset + this.$lory.clientWidth
)
      return this.leftOffset <= 0
   }

   isAtRightBorder() {
      console.debug("[isAtRightBorder] **" , this.$ul.offsetLeft, this.leftOffset, this.imagePaneWidth, - this.$ul.offsetLeft + this.$lory.clientWidth, this.leftOffset + this.$lory.clientWidth
)
      return this.imagePaneWidth <= this.leftOffset + this.$lory.clientWidth
   }

   render() {
      console.log("[render] * state", this.state)

      return (
         <div
            className='modal'
            id='slider-modal'
            ref={e => this.$modal = e} >
            <div className='modal-content'>
               <div
                  className='lory_slider js_lory_slider'
                  ref={e => this.$lory = e} >
                  <div
                     className='frame js_frame'>
                     <ul
                        ref={e => this.$ul = e}
                        className='slides js_slides'>
                        {this.props.links.map((link) =>
                           <li
                              key={link.id} >
                              <PureImage
                                 wrapperClassName='icon'
                                 src={link.url}
                                 alt={link.description}
                                 onLoad={this.onImageCompleted.bind(this)} /></li>)}</ul></div>
                  <div
                     ref={e => this.$prev = e}
                     className='prev waves-effect'>
                     <svg
                        onClick={this.onPrevClick.bind(this)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 501.5 501.5">
                        <g>
                           <path
                              fill="#DEB3AA"
                              d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z" /></g></svg></div>
                  <div
                     ref={e => this.$next = e}
                     className='next waves-effect'>
                     <svg
                        onClick={this.onNextClick.bind(this)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 501.5 501.5">
                        <g>
                           <path
                              fill="#DEB3AA"
                              d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z" /></g></svg></div>
                  <a
                     className='modal-action modal-close waves-effect btn-flat pulse chip'>
                        Закрыть</a></div></div></div>)}}
