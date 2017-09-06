
import React, { Component } from 'react';
import { Panel, ListGroup, ListGroupItem, Col, Row, Table, Accordion } from 'react-bootstrap';
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
    console.log(this.state.serviceStats)
    return (
      <Row className="show-grid">
      <Col xs={6} md={4}>
      <h3>Response status codes </h3>
      <Table striped bordered condensed hover>
      <thead>
      <tr>
      <th>Status</th>
      <th>Count</th>
      </tr>
      </thead>
      <tbody>
      <tr className="success">
      <td>2xx</td>
      <td>{this.state.serviceStats.hrsp_2xx}</td>
      </tr>
      <tr className="warning">
      <td>4xx</td>
      <td>{this.state.serviceStats.hrsp_4xx}</td>
      </tr>
      <tr className="danger">
      <td>5xx</td>
      <td>{this.state.serviceStats.hrsp_5xx}</td>
      </tr>
      <tr className="info">
      <td>Others</td>
      <td>{this.state.serviceStats.hrsp_other}</td>
      </tr>
      </tbody>
      </Table>
      <p> <strong>Total status code: </strong> {this.state.serviceStats.req_tot}</p>
      </Col>
      <Col xsHidden md={4}>
      <h3>Avg over last 1024 success. conn</h3>
      <p><strong>Queue Time: </strong> {this.state.serviceStats.qtime} ms</p>
      <p><strong>Connect Time: </strong> {this.state.serviceStats.ctime} ms</p>
      <p><strong>Response Time: </strong> {this.state.serviceStats.rtime} ms</p>
      <p><strong>Total Time: </strong> {this.state.serviceStats.ttime} ms</p>
      </Col>
      <Col xs={6} md={4}>
      <h3>Bytes</h3>
      <p><strong>In: </strong> {this.state.serviceStats.bin} </p>
      <p><strong>Out: </strong> {this.state.serviceStats.bout} </p>

      </Col>

      </Row>

    );
  }
}


export default StatsPanel;
