import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import ServicePanel from './ServicePanel.js';
import NetworkPanel from './NetworkPanel.js';
import GraphView from './GraphView.js';
import Networks from './Networks.js';
import Services from './Services.js';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/clusterView" component={GraphView} />
          <Route path="/service-panel/:name" component={ServicePanel} />
          <Route path="/network-panel/:name" component={NetworkPanel} />
          <Route path="/networks" component={Networks} />
          <Route path="/services" component={Services} />
        </Switch>
      </Router>

    )
  }
}

export default App;
