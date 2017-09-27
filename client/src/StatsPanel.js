
import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Col, Row, Table, Accordion } from 'react-bootstrap';
import {BarChart} from 'react-easy-chart';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';


var statsObj = {
    bin: 0,
    bout: 0,
    hrsp_1xx: 0,
    hrsp_2xx: 0,
    hrsp_3xx: 0,
    hrsp_4xx: 0,
    hrsp_5xx: 0,
    hrsp_other: 0,
    req_tot: 0,
    qtime: 0,
    ctime: 0,
    rtime: 0,
    ttime: 0
     };

class StatsPanel extends Component {
  state = {serviceStats:statsObj}

  async componentDidMount() {
    var api = '/stats/' + this.props.service;
    fetch(api,   {method: 'post',
        body: JSON.stringify})
      .then(res => res.json())
      .then(stats => {
        console.log(stats);
        this.setState({serviceStats:stats[0]});
       });
  }

  render() {

    var data = [
    {x: '200', y: this.state.serviceStats.hrsp_2xx, color:'#5cb678'},
    {x: '400', y: this.state.serviceStats.hrsp_4xx, color:'#e8ac78'},
    {x: '500', y: this.state.serviceStats.hrsp_5xx, color:'#e27168'},
    {x: 'Others', y: this.state.serviceStats.hrsp_other, color:'#6666ef'}];


    return (
      <Row className="show-grid">
      <Col xs={6} md={6}>
          <h5 className="title"><strong>Response status codes</strong></h5>
          <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '105px'}}>
        {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
      </div>
      <BarChart margin={{top: 10, right: 100, bottom: 50, left: 60}}
     axes grid  height={220} width={400} data={data} clickHandler={(d) => this.setState({dataDisplay: `Status code ${d.x} - ${d.y}`})}
       />

      <div id="total-req">
      <h5 className="title"> <strong>Total status code: </strong> {this.state.serviceStats.req_tot}</h5>
      </div>
      </Col>
      <Col xsHidden md={6}>
          <h5 className="title"><strong>Avg over last 1024 success connections</strong></h5>
      <div id="avg-time">
      <p><strong>Queue Time: </strong> {this.state.serviceStats.qtime} ms</p>
      <p><strong>Connect Time: </strong> {this.state.serviceStats.ctime} ms</p>
      <p><strong>Response Time: </strong> {this.state.serviceStats.rtime} ms</p>
      <p><strong>Total Time: </strong> {this.state.serviceStats.ttime} ms</p>
      <br/>
        <h5 className="title"><strong>Bytes</strong></h5>
      <p><strong>In: </strong> {this.state.serviceStats.bin} </p>
      <p><strong>Out: </strong> {this.state.serviceStats.bout} </p>
      </div>

      </Col>

      </Row>

    );
  }
}


export default StatsPanel;
