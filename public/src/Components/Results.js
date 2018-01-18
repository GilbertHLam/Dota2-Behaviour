import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'

class Results extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {page: 0 ,value: '', mostNeg: this.props.results.worst,mostPos: this.props.results.best,};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClick(event) {
    var requestString = {};
    requestString.userName = this.state.value;
    window.location.href = "http://localhost:4200/auth/steam";
    event.preventDefault();
  }
  nextPage(){
    this.setState({page:this.state.page+1});
  }
  lastPage(){
    this.setState({page:this.state.page-1});
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
    <h1> {this.state.mostNeg} </h1>
    </div>

    <div className = "resultsDiv">
    <h1> {this.state.mostPos} </h1>
    </div>
    </CSSTransitionGroup>

    </div>
    );
  }

}

export default Results
