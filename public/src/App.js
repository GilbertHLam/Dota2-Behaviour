import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import $ from 'jquery';
import LoadingScreen from './Components/LoadingScreen';
import Login from './Components/Login';
import './App.css';
import './index.css'
import './animate.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userid : '',
      isLoading: true,
      worst: '',
      best: ' ',
      counter:0,
      messages:['Finding your matches....'],
    };
  }
  render(){
    return (
      <div className="App">
      <Login />
    //  {this.state.userid && <LoadingScreen />}
      </div>
    );
  }
}




export default App;
