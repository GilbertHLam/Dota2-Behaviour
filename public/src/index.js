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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var requestString = {};
    requestString.userName = this.state.value;
    $.post("http://localhost:4200/nameToID", requestString, function(data, status){
      console.log("data: " + data);
      console.log("typeof: " + typeof data);
    });
    event.preventDefault();

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById("root"));

ReactDOM.render(<NameForm />, document.getElementById("userForm"));
