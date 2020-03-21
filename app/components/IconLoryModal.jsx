import { Component } from 'react'
import { lory } from 'lory.js'

export default class IconLoryModal extends Component {
   static defaultProps = {
      links: [],
      onLorySlideFrom: null,
   }

   state = { loadCounter: 0 }

   // system
   getSnapshotBeforeUpdate() {
      this.setState({ loadCounter: 0 })
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextState.loadCounter == 0
   }

   componentDidMount() {
      this.$lory.addEventListener('after.lory.init', this.loryResize.bind(this))
      this.$lory.addEventListener('on.lory.resize', this.loryResize.bind(this))
      this.$lory.addEventListener('after.lory.slide', this.props.onLorySlideFrom.bind(this))
      document.addEventListener('click', this.onDocumentClick.bind(this))
   }

   componentWillUnmount() {
      this.$lory.removeEventListener('after.lory.init', this.loryResize.bind(this))
      this.$lory.removeEventListener('on.lory.resize', this.loryResize.bind(this))
      this.$lory.removeEventListener('after.lory.slide', this.props.onLorySlideFrom.bind(this))
      document.removeEventListener('click', this.onDocumentClick.bind(this))
   }

   // events
   stateChanged() {
      if (this.state.loadCounter == this.props.links.length) {
         console.log("LORY COMPLETED")
         this.componentReady()
      }
   }

   componentReady() {
      console.log(this.$modal)
      this.modal = M.Modal.init(this.$modal, {})
      this.lory = lory(this.$lory, {
         slideSpeed: 750,
         ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
         rewind: true,
      })
   }

   loryResize() {
      this.items_width = [...this.$modal.querySelectorAll('li')].reduce((width, li) => {
         return width + li.clientWidth + parseInt(getComputedStyle(li).marginRight)
      }, 0)

      this.lory_scroll = this.items_width > this.$modal.clientWidth
      console.log("SIZE", this.items_width, this.$modal.clientWidth)
      if (this.lory_scroll) {
         this.$lory.querySelector('.prev').classList.remove('hidden')
         this.$lory.querySelector('.next').classList.remove('hidden')
         this.$lory.style.width = 'auto'
      } else {
         this.$lory.querySelector('.prev').classList.add('hidden')
         this.$lory.querySelector('.next').classList.add('hidden')
         this.$lory.style.width = this.items_width + 'px'
      }
   }

   openModal(index) {
      console.log("OPENING", this.lory_scroll)
      if (this.lory_scroll) {
         document.body.style.overflowY = 'hidden' // required to fix width of modal in proper value
         // TODO fix scroll to last (it is buggy)
         this.lory.slideTo(index, 0)
      }

      console.log("OPEN")
      this.modal.open()
   }

   onDocumentClick(e) {
      // TODO click to transparent area of the modal, get fired to the modal, not the 
      // page. Fix it then.
      if (! e.cancelBubble && this.isOpen() && ! e.target.closest('.modal')) {
         this.modal.close()
      }
   }

   onImageCompleted(e) {
      this.setState((prevState) => { return { loadCounter: prevState.loadCounter + 1 }}, this.stateChanged.bind(this))
   }

   // props
   isOpen() {
      return this.$modal && this.$modal.classList.contains('open')
   }

   render() {
      console.log("STATE", this.state)

      return (
         <div
            className='modal'
            id='slider-modal'
            ref={e => this.$modal = e} >
            <div className='modal-content'
                 ref={e => this.$co = e} >
               <div
                  className='lory_slider js_lory_slider'
                  ref={e => this.$lory = e} >
                  <div
                     className='frame js_frame'>
                     <ul
                        className='slides js_slides'>
                        {this.props.links.map((link) =>
                           <li
                              key={link.id} >
                              <img
                                 className='icon'
                                 src={link.url}
                                 alt={link.description}
                                 onLoad={this.onImageCompleted.bind(this)}
                                 onError={this.onImageCompleted.bind(this)} /></li>)}</ul></div>
                  <div className='js_prev prev waves-effect'>
                     <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 501.5 501.5">
                        <g>
                           <path
                              fill="#DEB3AA"
                              d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z" /></g></svg></div>
                  <div className='js_next next waves-effect'>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 501.5 501.5">
                        <g>
                           <path
                              fill="#DEB3AA"
                              d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z" /></g></svg></div>
                  <a
                     className='modal-action modal-close waves-effect btn-flat pulse chip'
                     href="javascript:">
                        Закрыть</a></div></div></div>)}}
