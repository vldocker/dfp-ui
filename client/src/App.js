import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import ServicePanel from './ServicePanel.js';
import GraphView from './GraphView.js';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';





  // ...
class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/proxy-ui" component={GraphView} />
          <Route path="/service-panel/:name" component={ServicePanel} />
          <Route path="/network-panel/:name" component={ServicePanel} />
        </Switch>
      </Router>
    )
  }
}



export default App;
