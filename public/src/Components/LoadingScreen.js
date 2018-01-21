import React, { Component } from 'react';
import $ from 'jquery';
import { CSSTransitionGroup } from 'react-transition-group'
import Results from './Results'
class LoadingScreen extends Component {


  constructor(){
    super();
    this.state = {
      messages:[''],
      counter : 0,
      isLoading : true,
    }
    this.getScores();
  }
  getScores(){
    var innerRequest = {}
    innerRequest.userID = window.location.href.substring(window.location.href.indexOf('id/')+3);
    innerRequest.limit = 15;

    var requestFunc = function(response, stat){
      console.log(response);
      this.setState({results: response, page: 0, isLoading:false});
    }
    this.state.messages = ['Finding your matches....'];
    setInterval(function() {
      var temp = [ 'Reading chat logs...', 'Analyzing sentiment...', 'You\'ve said some pretty interesting things...', '....this is taking pretty long...try refreshing!','Here....I\'ll refresh it for you!'];
      if(this.state.counter < 5){
        var tempMessages = [];
        tempMessages.push(temp[this.state.counter++]);
        this.setState({messages: tempMessages});
      }
      else if(this.state.counter > 4 && this.state.isLoading) {
        window.location.reload();
      }
    }.bind(this), 9000);

    requestFunc = requestFunc.bind(this);
    $.post("http://localhost:4200/findRecentMatches", innerRequest, requestFunc);
  }

  render() {
    const items = this.state.messages.map((item, i) => (
      <div key={item}>
      {item}
      </div>
    ));
    const isLoading = this.state.isLoading;
    return (
      <div>
      {isLoading ? (
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
        <h2>
        <CSSTransitionGroup transitionName="headerForm"
        transitionEnterTimeout={1500}
        transitionLeaveTimeout={1500}>
        {items}
        </CSSTransitionGroup>
        </h2>
        </div>
      ) : (
        <Results results = {this.state.results}/>
      )}
      </div>
    );
  }
}

export default LoadingScreen;
