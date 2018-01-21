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

      <div className = "summaryDiv">
        <img src={this.state.results.image} className="round"></img>
        <h4 className="username"> {this.state.results.name} </h4>
        <div className="statsContainer">
        <div className="miniStats">
        <div className="subContainer">
          <span className="miniTitle">Average Score</span>
          <span className="miniResult">
          {this.state.results.averageScore > 0 ? (
            <div className="good">{this.state.results.averageScore}%</div>
          ) : (
            <div className="bad">{this.state.results.averageScore}%</div>
          )}
          </span>
          </div>
          <div className="subContainer">
          <span className="miniTitle">Messages Sent</span>
          <span className="miniResult">
            <div style={{color: '#e5c113'}}>{this.state.results.totalMessages}</div>
          </span>
          </div>
          <div className="subContainer">
          <span className="miniTitle">Negative Messages</span>
          <span className="miniResult">
            <div className="bad">{this.state.results.negativeMessages}</div>
          </span>
          </div>
          <div className="subContainer">
          <span className="miniTitle">Positive Messages</span>
          <span className="miniResult">
            <div className="good">{this.state.results.positiveMessages}</div>
          </span>
        </div>
        <div className="subContainer">
        <span className="miniTitle">Neutral Messages</span>
        <span className="miniResult">
          <div>{this.state.results.neutralMessages}</div>
        </span>
      </div>
        </div>
        </div>

      </div>

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
    </CSSTransitionGroup>

    </div>
    );
  }

}

export default Results
