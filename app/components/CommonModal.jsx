import { Component } from 'react'
import PropTypes from 'prop-types'
import * as Axios from 'axios'

export default class CommonModal extends Component {
   static defaultProps = {
      id: null,
      remoteName: null,
      remoteNames: null,
      open: false,
      onUpdateRecord: null,
      onCloseModal: null,
   }

   static propTypes = {
      remoteName: PropTypes.string.isRequired,
      remoteNames: PropTypes.string.isRequired,
      open: PropTypes.bool,
      onUpdateRecord: PropTypes.func.isRequired,
      onCloseModal: PropTypes.func.isRequired,
   }

   state = this.getDefaultState()

   componentWillReceiveProps(nextProps) {
      if (this.props != nextProps) {
         this.setState(this.getDefaultState(nextProps))
         // clear old error
         this.$error.setState({error: null})
      }
   }

   componentDidMount() {
      this.modal = M.Modal.init(this.$modal, {
         complete: this.props.onCloseModal.bind(this)
      })
   }

   componentDidUpdate() {
      this.$submit.setState({valid: this.$form.valid})

      if (this.props.open) {
         this.modal.open()
      }
   }

   newRecord() {
      this.setState(this.getCleanState())
   }

   onSubmitSuccess(response) {
      console.log("SUCCESS", response)
      this.props.onUpdateRecord(response.data)
      this.$error.setState({error: null})
      this.modal.close()
   }

   onSubmitError(response) {
      let error

      console.log("ERROR", response, this.state, this.$form.query)

      if (response.responseJSON) {
         let errors = []

         Object.entries(response.responseJSON).forEach(([key, value]) => {
            errors.push(value.map((e) => { return key + " " + e }))
         })

         error = errors.join(", ")
      } else {
         error = response.responseText
      }

      this.$error.setState({error: error})
   }

   onSubmit(e) {
      e.stopPropagation()
      e.preventDefault()

      console.log("S I", this.state, this.props)

      let record = this.$form.serializedQuery(),
          request = { data: {}},
          request_url_base = '/' + this.props.remoteNames,
          id = this.props.id

      request.data[this.props.remoteName] = record

      if (id) {
         request.method = 'put'
         request.url = request_url_base + '/' + id + '.json'
      } else {
         request.method = 'post'
         request.url = request_url_base + '.json'
      }

      console.log("STATE",this.state)
      console.log(request)

      Axios(request)
        .then(this.onSubmitSuccess.bind(this))
        .catch(this.onSubmitError.bind(this))
   }

   onFormUpdate() {
      if (this.$form) {
         console.log(this.$form.valid)
         this.$submit.setState({valid: this.$form.valid})
      }
   }

   onCloseClick() {
      this.modal.close()
   }}
