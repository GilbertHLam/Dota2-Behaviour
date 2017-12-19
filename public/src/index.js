import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as $ from 'jquery';
import './index.css';

class Results extends Component {

  constructor(props) {

    super(props);
    this.state = {
      isLoading: true,
      worst: '',
      best: ' ',
      counter:0,
    };
    if(window.location.href.includes('id')){
      this.getScores = this.getScores.bind(this);
      this.getScores();
    }
  }
  getScores(){
    var innerRequest = {}
    innerRequest.userID = window.location.href.substring(window.location.href.indexOf('id/')+3);
    innerRequest.limit = 150;
    var requestFunc = function(response, stat){
      console.log(response);
      response = JSON.parse(response);
      this.setState({worst :response.mostNeg, best: response.mostPos, currentPage: 1, isLoading:false});
    }
    setInterval(function() {
      if(this.state.counter < 5)
        this.setState({counter: this.state.counter+1});
        else if(this.state.counter > 4 && this.state.isLoading) {
          window.location.reload();
        }
    }.bind(this), 5000);
    requestFunc = requestFunc.bind(this);
    $.post("http://localhost:4200/findRecentMatches", innerRequest, requestFunc);
  }
  render(){
    var loadMessages = ['Finding your matches....', 'Reading chat logs...', 'Analyzing sentiment...', 'You\'ve said some pretty interesting things...', '....this is taking pretty long...try refreshing!','Here....I\'ll refresh it for you!'];
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
        { this.state.isLoading ? (
          <div class='center'>
          <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
          <div class="circle"></div>
          </div><div class="gap-patch">
          <div class="circle"></div>
          </div><div class="circle-clipper right">
          <div class="circle"></div>
          </div>
          </div>
          </div>
          <h2>{loadMessages[this.state.counter]}</h2>
          </div>

        ) : (
          <div class='fade-in' style={{visibility:'visible', opacity:'1'}}>
          <div id="positivityScore" >
          <h1>{this.state.best}</h1>
          </div>
          <div id="negativityScore" >
          <h1>{this.state.worst}</h1>
          </div>

          </div>

        )}
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
