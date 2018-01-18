import React, { Component } from 'react';

class Results extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {page: 0 ,value: '', mostNeg: this.props.results.worst,mostPos: this.props.results.mostPos,};
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
  nextPage(){
    this.setState({page:this.state.page+1});
  }
  lastPage(){
    this.setState({page:this.state.page-1});
  }
  render() {
    return (
    <div>
    //<i class="arrow-left" onClick={this.lastPage}></i>
    //<i class="arrow-right" onClick={this.nextPage}></i>

    <div class='center' style={{visibility:'visible', opacity:'1'}}>
    <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10077;</h1>
    <h1 style={{color:'#137c39'}}>{this.state.mostNeg}</h1>
    <h1 style={{fontSize:'6vw',color:'#137c39'}}>&#10080;</h1>
    <h2> - Doggerdoo (2017)</h2>
    </div>
    </div>
    );
  }

}

export default Results
