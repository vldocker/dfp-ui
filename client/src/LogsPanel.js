import React, { Component } from 'react'
import axios from 'axios'

class LogsPanel extends Component {
  constructor () {
    super()
    this.state = {
      serviceErrLogs: ''
    }
  }
  componentDidMount () {
    this.fetchServiceLogs()
  }
  fetchServiceLogs () {
    let api = '/services/logs/' + this.props.service
    axios.post(api)
    .then(res => {
      this.setState({
        serviceErrLogs: res.data
      })
    })
    .catch(err => {
      // TODO: Add normal exception handlers
      console.log(err)
    })
  }
  render () {
    return (
      <p>{this.state.serviceErrLogs}</p>
    )
  }
}

export default LogsPanel
