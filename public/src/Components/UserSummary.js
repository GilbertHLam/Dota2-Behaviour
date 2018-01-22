import React, { Component } from 'react';

class UserSummary extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.results);
    this.state = {results: this.props.results};
  }
  render() {
    return(
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

    );
  }
}

export default UserSummary;
