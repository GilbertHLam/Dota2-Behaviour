import React, { Component } from 'react';

class MostPosNeg extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.results);
    this.state = {results: this.props.results, isHover: false};
  }
  handleMouseOver () {
    this.setState({ isHover: true });
  }

  // GOOD: set this.state.isHovering to false on mouse leave
  handleMouseOut () {
    this.setState({ isHover: false });
  }

  render(){
    const isGood = this.props.good;
    var thisMatch;
    if(isGood == 'true')
      thisMatch = this.state.results.matches[this.state.results.mostPositive.matchIndex];
    else
      thisMatch = this.state.results.matches[this.state.results.mostNegative.matchIndex];

    var winLoss = '';
    if(thisMatch.won == 1){
      winLoss = "VICTORY";
    }
    else {
      winLoss = "DEFEAT";
    }
    return(
      <div>
      {isGood == 'true'? (
        <div className = "resultsDiv" onMouseOver={this.handleMouseOver.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}>
        {this.state.isHover == false ? (
          <div>
          <h4> Most Negative </h4>
          <h5 className="bad"> "{this.state.results.mostNegative.message}" </h5>
          <h5 > - {thisMatch.username}
          &nbsp;&nbsp;({thisMatch.date})
          </h5>
          </div>
        ) : (
          <div>
          <h4> Match ID: {thisMatch.matchID} </h4>
          <h5>
          K: {thisMatch.kills}&nbsp;&nbsp;
          D: {thisMatch.deaths}&nbsp;&nbsp;
          A: {thisMatch.assists}
          </h5>
          {winLoss == 'DEFEAT' ? (
            <h3 className="bad"> {winLoss} </h3>
          ) : (
            <h3 className="good"> {winLoss} </h3>
          )};

          </div>
        )};
        </div>
      ):(
        <div className = "resultsDiv" style={{float:'right'}} onMouseOver={this.handleMouseOver.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}>
        {this.state.isHover == false ? (
          <div>
          <h4> Most Positive </h4>
          <h5 className="good"> "{this.state.results.mostPositive.message}" </h5>
          <h5 > - {thisMatch.username}
          &nbsp;&nbsp;({thisMatch.date})
          </h5>
          </div>
        ) : (
          <div>
          <h4> Match ID: {thisMatch.matchID} </h4>
          <h5>
          K: {thisMatch.kills}&nbsp;&nbsp;
          D: {thisMatch.deaths}&nbsp;&nbsp;
          A: {thisMatch.assists}
          </h5>
          {winLoss == 'DEFEAT' ? (
            <h3 className="bad"> {winLoss} </h3>
          ) : (
            <h3 className="good"> {winLoss} </h3>
          )};
          </div>
        )};
        </div>
      )}
</div>
    )};
  }


export default MostPosNeg;
