
import React, { Component } from 'react';
import Graph from  'react-graph-vis';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


   var options = {
     width: "100%",
         height: "100%",
         autoResize: true,
         layout: {
             hierarchical: false
         },
       nodes: {
           shape: 'image',
           size: 20,
           font: {
               size: 8,
           },
           borderWidth: 1,
           shadow:true
       },
       edges: {
           width: 0,
           shadow:false
       }
   };

var network = {};
function setNetworkInstance(nw){
  network = nw;
}

var event = {
  selectNode: function(event) {
    ///var
    console.log(event.nodes[0]);
    console.log(network.body);

    //add if isnt network
    window.location.href = window.location.origin + "/service-panel/" + event.nodes[0].substring(9,event.nodes[0].length);
  }

}

class GraphView extends Component {
  state = {graph: {nodes:[], edges:[]}}

  async componentDidMount() {
    fetch('/swarm-cluster-graph',
    {method: 'post',
      body: JSON.stringify})
      .then(res => res.json())
      .then(updateGraph => {
        var nodes = [];
        updateGraph.nodes.forEach(function(nodeName){
          var node = {};
          node.id = "Services-" + nodeName;
          node.label = nodeName;
          node.group = "Services";
          node.shape=  'image';
          node.image = 'settings.svg';
          nodes.push(node);
        });

        updateGraph.networks.forEach(function(networkName){
          var node = {};
          node.id = "Networks-" + networkName;
          node.label = networkName;
          node.group = "Networks";
          node.shape=  'image';
          node.image = 'share.svg';
          nodes.push(node);
        });
        var editEdgesObject = [];
        updateGraph.edges.forEach(function(edge){
          var newEdge = {};
          newEdge.from = "Services-" + edge.from;
          newEdge.to = "Networks-" + edge.to;
          editEdgesObject.push(newEdge);
        });
        var newGraph = {};
        newGraph.nodes = nodes;
        newGraph.edges = editEdgesObject;
        this.setState({graph:newGraph});
       });
  }

  render() {
    return (
        <div className="map">
        <Graph graph={this.state.graph} getNetwork={setNetworkInstance} options={options} events={event} style={{ width: 'auto', height: '800px',font: 'Open Sans' }} />
        <div>Icons made by <a href="https://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>

    );
  }
}

export default GraphView;
