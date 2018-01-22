import React, { Component } from 'react';
import UserSummary from './UserSummary.js';
import Graph from './Graph.js';
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
      <div className = "resultsDiv">
        <h4> Most Negative </h4>
        <h5 className="bad"> "{this.state.results.mostNegative.message}" </h5>
        <h5 > - {this.state.results.matches[this.state.results.mostNegative.matchIndex].username}
        &nbsp;&nbsp;({this.state.results.matches[this.state.results.mostNegative.matchIndex].date})
        </h5>
      </div>


      <div className = "resultsDiv" style={{float:'right'}}>
        <h4> Most Positive </h4>
        <h5 className="good"> "{this.state.results.mostPositive.message}" </h5>
        <h5 > - {this.state.results.matches[this.state.results.mostPositive.matchIndex].username}
        &nbsp;&nbsp;({this.state.results.matches[this.state.results.mostPositive.matchIndex].date})
        </h5>
      </div>
    </div>

    <Graph results = {this.state.results}/>
    </CSSTransitionGroup>

    </div>
    );
  }

}

export default Results
