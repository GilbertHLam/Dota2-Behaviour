import React, { Component } from 'react';
import $ from 'jquery';
import LoadingScreen from './LoadingScreen';

class Login extends React.Component {
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

        <div class='center'style={{textAlign:'center'}}>
        <h1>
        DOTA 2 BEHAVIOUR
        </h1>
        <h3 className="small">
        ANALYZE YOUR GAME BEHAVIOUR
        </h3>
        <div id='userForm'>
        </div>
        <div onClick={this.handleClick}>
        <button class="myButton"></button>
        </div>
        </div>

      );
    }
    else {
      this.state.userid = window.location.href.substring(window.location.href.indexOf('id/')+3);
      return(
        <LoadingScreen />
      );
    }
  }
}

export default Login;
