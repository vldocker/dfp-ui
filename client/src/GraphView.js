
import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class GraphView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      network: {},
      options: {
        width: '100%',
        height: '100%',
        autoResize: false,
        layout: {
          hierarchical: false
        },
        nodes: {
          shape: 'image',
          size: 20,
          font: {
            size: 8
          },
          borderWidth: 1,
          shadow: true
        },
        edges: {
          width: 0,
          shadow: false
        }
      },
      panelType: ''
    }
    this.setNetworkInstance = this.setNetworkInstance.bind(this)
    this.selectNode = this.selectNode.bind(this)
  }

  async componentDidMount () {
    await this.generateClusterView()
  }

  async generateClusterView () {
    axios.post('/clusterView', {})
    .then(res => {
      let newGraph = res.data
      var nodes = []
      newGraph.nodes.forEach((nodeName) => {
        var node = {}
        node.id = 'Services-' + nodeName
        node.label = nodeName
        node.group = 'Services'
        node.shape = 'image'
        node.image = 'settings.svg'
        nodes.push(node)
      })

      newGraph.networks.forEach((networkName) => {
        var node = {}
        node.id = 'Networks-' + networkName
        node.label = networkName
        node.group = 'Networks'
        node.shape = 'image'
        node.image = 'share.svg'
        nodes.push(node)
      })
      var editedEdgesObject = []
      newGraph.edges.forEach((edge) => {
        var newEdge = {}
        newEdge.from = 'Services-' + edge.from
        newEdge.to = 'Networks-' + edge.to
        editedEdgesObject.push(newEdge)
      })
      var newGraphToDisplay = {}
      newGraphToDisplay.nodes = nodes
      newGraphToDisplay.edges = editedEdgesObject
      this.setState({graph: newGraphToDisplay})
    })
    .catch(err => {
      console.log(err)
      // TODO: Add error handling
    })
  }

  setNetworkInstance (nw) {
    this.setState({
      network: nw
    })
  }

  selectNode (event) {
    console.log(event)
    if (event.nodes[0].indexOf('Services') !== -1) {
      this.setState({
        panelType: '/service-panel/'
      })
    } else {
      this.setState({
        panelType: '/network-panel/'
      })
    }
    window.location.href = window.location.origin + this.state.panelType + event.nodes[0].substring(9, event.nodes[0].length)
  }

  render () {
    let event = {
      selectNode: this.selectNode
    }
    return (
        <div className="map">
          <Graph graph={this.state.graph} getNetwork={this.setNetworkInstance} options={this.state.options} events={event} style={{ width: 'auto', height: '800px', font: 'Open Sans' }} />
          <div>Icons made by <a href="https://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>

    )
  }
}

export default GraphView
