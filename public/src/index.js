import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
  }
  nextPage(){
    this.setState({page:this.state.page+1});
  }
  lastPage(){
    this.setState({page:this.state.page-1});
  }
  getScores(){
    var innerRequest = {}
    innerRequest.userID = window.location.href.substring(window.location.href.indexOf('id/')+3);
    innerRequest.limit = 150;
    var requestFunc = function(response, stat){
      console.log(response);
      response = JSON.parse(response);
      this.setState({worst :response.mostNeg, best: response.mostPos, page: 0, isLoading:false});
    }
    setInterval(function() {
      if(this.state.counter < 5)
        this.setState({counter: this.state.counter+1});
        else if(this.state.counter > 4 && this.state.isLoading) {
          window.location.reload();
        }
    }.bind(this), 8000);
    requestFunc = requestFunc.bind(this);
    $.post("http://localhost:4200/findRecentMatches", innerRequest, requestFunc);
  }

  renderLoading(){
    var loadMessages = ['Finding your matches....', 'Reading chat logs...', 'Analyzing sentiment...', 'You\'ve said some pretty interesting things...', '....this is taking pretty long...try refreshing!','Here....I\'ll refresh it for you!'];
    return (
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
    );
  }

  render(){

    var currentUrl = window.location.href;
    if(!currentUrl.includes('id')){
      return (
        <div class='center'style={{textAlign:'center'}}>
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
      if(this.state.isLoading){
        return (
          <ReactCSSTransitionGroup transitionName="example">
          {this.renderLoading()}
          </ReactCSSTransitionGroup>
        );
      }
      else if(this.state.page == 0){
        return (
        <div>
        <i class="arrow-right" onClick={this.nextPage}></i>
        <div class='center' style={{visibility:'visible', opacity:'1'}}>
        <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10077;</h1>
        <h1 style={{color:'#137c39'}}>{this.state.best}</h1>
        <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10080;</h1>
        <h2> - Doggerdoo (2017)</h2>
        </div>
        </div>
      );
      }
      else if(this.state.page == 1){
        return (
        <div>
        <i class="arrow-left" onClick={this.lastPage}></i>
        <i class="arrow-right" onClick={this.nextPage}></i>

        <div class='center' style={{visibility:'visible', opacity:'1'}}>
        <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10077;</h1>
        <h1 style={{color:'#137c39'}}>{this.state.worst}</h1>
        <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10080;</h1>
        <h2> - Doggerdoo (2017)</h2>
        </div>
        </div>
      );
      }
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
