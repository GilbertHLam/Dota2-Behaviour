import React, { Component } from 'react';
import {LineChart} from 'react-easy-chart';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.results);
    this.state = {results: this.props.results};
  }
  buildGraph(){

    var data = [];
    for(var i = 0; i < Object.keys(this.state.results.matches).length; i++){
      data[i] = {x:i, y:Number(this.state.results.matches[i].average)};
    }
    console.log(this.state);
    return data;

  }

  render() {
    var data = this.buildGraph();
    this.state = {data: data, results:this.state.results};
    console.log(this.state);
    return(
      <div className = "summaryDiv" style={{height:'55%'}}>
      <div className = "resultsDiv" style={{width:'100%'}}>
      <h4> Trends </h4>
      <h5> Average Score per Match </h5>
      <LineChart

       lineColors={['white', 'gray','green','red']}
       margin={{top: 10, right: 10, bottom: 10, left: 10}}
       axisLabels={{x: 'MATCHES PLAYED', y: 'SENTIMENT SCORE'}}
       width={900}
       yDomainRange={[-100, 100]}
       xDomainRange={[0,Object.keys(this.state.results.matches).length]}
       height={350}
       data={
       [this.state.data,
       [{x:0,y:0},{x:Object.keys(this.state.results.matches).length-1, y:0}],
       [{x:0,y:100},{x:Object.keys(this.state.results.matches).length-1, y:100}],
       [{x:0,y:-100},{x:Object.keys(this.state.results.matches).length-1, y:-100}]]
     }
       style={{
      '.label': {
        color: 'green',
        fontSize:'100px',
      }
    }}

      />
      </div>

      </div>
    );
  }
}

export default Graph;
