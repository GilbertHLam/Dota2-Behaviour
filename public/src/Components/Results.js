import React, { Component } from 'react';
import UserSummary from './UserSummary.js';
import Graph from './Graph.js';
import MostPosNeg from './MostPosNeg';
import { CSSTransitionGroup } from 'react-transition-group';

class Results extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.results);
    this.state = {results: this.props.results};
  }


  render() {
    return (
    <div>
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>

      <UserSummary results = {this.state.results}/>

    <div className="summaryDiv" style={{backgroundColor : '#242634'}}>
      <MostPosNeg results = {this.state.results} good = 'true'/>
      <MostPosNeg results = {this.state.results} good = 'false'/>
    </div>

    <Graph results = {this.state.results}/>
    </CSSTransitionGroup>

    </div>
    );
  }

}

export default Results
