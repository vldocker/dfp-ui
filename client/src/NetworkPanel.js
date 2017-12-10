import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import JSONTree from 'react-json-tree'
import BarChart from 'react-bar-chart'
import { Panel, ListGroup, ListGroupItem, Col, Row, Table, Accordion } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import NetworkConfPanel from './NetworkConfPanel.js'

class NetworkPanel extends Component {
  render () {
    return (
      <div className="map">
      <br/>
      <br/>
      <div className="content">
          <div className="container-fluid">
              <div className="row">
              <div className="col-md-12">
              <h2 className="header"><i className="pe-7s-global"></i> {this.props.match.params.name}</h2>
              </div>
                  <div className="col-md-12">
                      <div className="card">
                          <div className="header">
                              <h4 className="title">Network Configurations</h4>
                          </div>
                          <div id="conf">
                          <NetworkConfPanel service={this.props.match.params.name}></NetworkConfPanel>
                          </div>
                      </div>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
              </div>
              </div>
          </div>
      </div>
    )
  }
}

export default NetworkPanel
