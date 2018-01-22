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
    innerRequest.limit = 150;

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
    }.bind(this), 12000);

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
        <div className='center'>
        <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-blue-only">
        <div className="circle-clipper left">
        <div className="circle"></div>
        </div><div className="gap-patch">
        <div className="circle"></div>
        </div><div className="circle-clipper right">
        <div className="circle"></div>
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
