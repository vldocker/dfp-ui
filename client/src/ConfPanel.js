
import React, { Component } from 'react'
import JSONTree from 'react-json-tree'
import axios from 'axios'

class ConfPanel extends Component {
  constructor () {
    super()
    this.state = {
      serviceConf: {},
      colors: {
        base00: '#FFFFFF',
        base01: '#2e2f30',
        base02: '#515253',
        base03: '#737475',
        base04: '#959697',
        base05: '#b7b8b9',
        base06: '#dadbdc',
        base07: '#fcfdfe',
        base08: '#e31a1c',
        base09: '#e6550d',
        base0A: '#dca060',
        base0B: '#31a354',
        base0C: '#80b1d3',
        base0D: '#3182bd',
        base0E: '#756bb1',
        base0F: '#b15928'
      }
    }
  }
  componentDidMount () {
    this.fetchServiceConfiguration()
  }
  fetchServiceConfiguration () {
    let api = '/services/configurations/' + this.props.service
    axios.post(api)
    .then(res => {
      this.setState({
        serviceConf: res.data
      })
    })
    .catch(err => {
      // TODO: Add normal exception handlers
      console.log(err)
    })
  }
  render () {
    return (
      <JSONTree data={this.state.serviceConf} invertTheme={false} theme={this.state.colors}></JSONTree>
    )
  }
}

export default ConfPanel
