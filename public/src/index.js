import React from 'react';
import ReactDOM from 'react-dom';
import * as $ from 'jquery';
import './index.css';

class Home extends React.Component {
  render(){
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
    )
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

    function getMatches(data){
      var tempData = JSON.parse(data);
      var innerRequest = {}
      innerRequest.userID = tempData.userID;
      innerRequest.userName = requestString.userName;
      innerRequest.limit = 50;
      $.post("http://localhost:4200/findRecentMatches", innerRequest, function(response, stat){

      });
    }

    event.preventDefault();

  }

  render() {
    return (
      <div onClick={this.handleClick}>
            <button class="myButton"></button>
      </div>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById("root"));

ReactDOM.render(<NameForm />, document.getElementById("userForm"));
