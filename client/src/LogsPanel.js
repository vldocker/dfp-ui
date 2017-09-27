
import React, { Component } from 'react';

class LogsPanel extends Component {
  state = {serviceErrLogs:""}

  async componentDidMount() {
    var api = '/services/logs/' + this.props.service;
    fetch(api,{method: 'post',
        body: JSON.stringify})
      .then(res => res.json())
      .then(logs => {
        this.setState({serviceErrLogs:logs});
       });
  }

  render() {
    return (
      <p>{this.state.serviceErrLogs}</p>

    );
  }
}

export default LogsPanel;
