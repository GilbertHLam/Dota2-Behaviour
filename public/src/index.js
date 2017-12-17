import React from 'react';
import ReactDOM from 'react-dom';
import * as $ from 'jquery';
import './index.css';

class Home extends React.Component {
  getScores(){
    var innerRequest = {}
    innerRequest.userID = window.location.href.substring(window.location.href.indexOf('id/')+3);
    innerRequest.limit = 1;
    $.post("http://localhost:4200/findRecentMatches", innerRequest, function(response, stat){
      console.log(response);
      response = JSON.parse(response);
      $('#positivityScore').animate({width:"50%"},1000);
      $('#negativityScore').animate({width:"50%"},1000);
      $('#positivity').html("<h2 style='color:#9c4345'>Most Positive Message</h1><h2 class='sentence'>"+response.mostPos+"</h2></div>").hide().fadeIn(2000);
      $('#negativity').html("<h2 style='color:#137c39'>Most Negative Message</h1><h2 class='sentence'>"+response.mostNeg+"</h2></div>").hide().fadeIn(2000);
      $('#loading').css('visibility','hidden');
    });
    return(
      <div>
      <div id="positivityScore" style={{width:'0%'}}>
      <div id="positivity">
      </div>
      </div>
      <div id="negativityScore" style={{width:'0%'}}>
      <div id="negativity">
      </div>
      </div>
      </div>
    );
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
        this.getScores()
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




ReactDOM.render(<Home />, document.getElementById("root"));
ReactDOM.render(<NameForm />, document.getElementById("userForm"));
