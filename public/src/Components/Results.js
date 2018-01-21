import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'

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


    <div className = "resultsDiv">
    <h4> Most Negative </h4>
    <h5 className="bad"> "{this.state.results.mostNegative.message}" </h5>
    <h5 > {this.state.results.mostNegative.score} </h5>
    </div>


    <div className = "resultsDiv">
    <h4> Most Positive </h4>
    <h5 className="good"> "{this.state.results.mostPositive.message}" </h5>
    <h5 > {this.state.results.mostPositive.score} </h5>
    </div>


    </CSSTransitionGroup>

    </div>
    );
  }

}

export default Results
