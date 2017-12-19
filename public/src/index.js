import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as $ from 'jquery';
import './index.css';

class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      worst: 'LOADING..',
      best: ' ',
    };
    if(window.location.href.includes('id')){
      this.getScores = this.getScores.bind(this);
      this.getScores();
    }

  }
  getScores(){
    var innerRequest = {}
    innerRequest.userID = window.location.href.substring(window.location.href.indexOf('id/')+3);
    innerRequest.limit = 30;
    var requestFunc = function(response, stat){
      console.log(response);
      response = JSON.parse(response);
      this.setState({worst :response.mostNeg, best: response.mostPos, isLoading:false});
    }
    requestFunc = requestFunc.bind(this);
    $.post("http://localhost:4200/findRecentMatches", innerRequest, requestFunc);
  }
  render(){
    var currentUrl = window.location.href;
    if(!currentUrl.includes('id')){
      return (
        <div style={{textAlign:'center'}}>
        <h1>
        DOTA 2 BEHAVIOUR
        </h1>
        <h3 className="small">
        ANALYZE YOUR GAME BEHAVIOUR
        </h3>
        <div id='userForm'>
        </div>
        </div>
      );
    }

    else {
      return (
        <div>
        <div id="negativityScore">
        <h1>{this.state.worst}</h1>
        </div>
        <div id="positivityScore">
        <h1>{this.state.best}</h1>
        </div>
        </div>
      );
    }
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

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

  render() {
    var currentUrl = window.location.href;
    if(!currentUrl.includes('id')){
      return (
        <div onClick={this.handleClick}>
        <button class="myButton"></button>
        </div>
      );
    }
    else {
      return(
        <div>
        </div>
      );
    }
  }
}




ReactDOM.render(<Results />, document.getElementById("root"));
ReactDOM.render(<NameForm />, document.getElementById("userForm"));
