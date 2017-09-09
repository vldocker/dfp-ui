
import React, { Component } from 'react';
import JSONTree from 'react-json-tree';


var colors = {
  scheme: 'brewer',
  author: 'timothée poisot (http://github.com/tpoisot)',
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
};

class NetworkConfPanel extends Component {
  state = {serviceConf: {}};

  async componentDidMount() {
    var api = '/networks/' + this.props.service;
    fetch(api,   {method: 'post',
        body: JSON.stringify})
      .then(res => res.json())
      .then(conf => {
        this.setState({serviceConf:conf[0]});
       });
  }

  render() {
    return (
      <JSONTree data={this.state.serviceConf} invertTheme={false} theme={colors}></JSONTree>

    );
  }
}

export default NetworkConfPanel;
