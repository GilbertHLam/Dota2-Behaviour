import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Home extends React.Component {
  render(){
    return (
      <div style="text-align:center">
      <h1>
        DOTA 2 BEHAVIOUR
      </h1>
      <h3 class="small">
        ANALYZE YOUR GAME BEHAVIOUR
      </h3>
      <br>
      <button class="myButton" onclick="getLogin()"> </button>
    </div>
    )
  }
}

ReactDOM.render(<Home />, document.getElementById("root"));

function getLogin(){
  $http.get('')
}
