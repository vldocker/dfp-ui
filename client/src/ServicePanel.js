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
import ConfPanel from './ConfPanel.js'
import LogsPanel from './LogsPanel.js'
import StatsPanel from './StatsPanel.js'

class ServicePanel extends Component {
  render () {
    return (
        <div className="map">
            <br/>
            <br/>
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="header"><i className="pe-7s-config"></i> {this.props.match.params.name}</h2>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Service Configurations</h4>
                                </div>
                                <div id="conf">
                                    <ConfPanel service={this.props.match.params.name}></ConfPanel>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Stats</h4>
                                </div>
                                <StatsPanel service={this.props.match.params.name}></StatsPanel>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <div className="col-md-12" >
                            <div className="card" id="logs">
                                <div className="header">
                                    <h4 className="title">Service logs</h4>
                                </div>
                                <LogsPanel service={this.props.match.params.name}></LogsPanel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default ServicePanel
