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
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class Services extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clusterServices: []
    }
  }

  async componentDidMount () {
    var api = '/services'
    axios.post(api, {})
    .then(res => {
      this.setState({
        clusterServices: res.data
      })
    })
    .catch(err => {
      // TODO: Handle exceptions
      console.log(err)
    })
  }

  render () {
    return (
      <div className="map">
        <br/>
        <br/>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <h2 className="header">Services</h2>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div className="content all-icons">
                    <div className="row">
                      {this.state.clusterServices.map(serviceName =>
                        <div className="font-icon-list col-lg-2 col-md-3 col-sm-4 col-xs-6 col-xs-6">
                          <a href={'/service-panel/' + serviceName}>
                          <div className="font-icon-detail"><i className="pe-7s-config"></i>
                            <input type="text" value={serviceName}></input>
                          </div>
                          </a>
                        </div>
                        )}
                    </div>
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

export default Services
