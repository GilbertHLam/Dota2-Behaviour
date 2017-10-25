import React from 'react';
import ReactDOM from 'react-dom';
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

      <button className="myButton" onClick={getLogin}> </button>
    </div>
    )
  }
}

ReactDOM.render(<Home />, document.getElementById("root"));

function getLogin(){

  var payload = {
    userName: "Doggerdoo"
  };
fetch("http://localhost:4200/nameToID",
{
    method: "post",
    body: 'doggerdoo'
})
.then(function(res){
   return(res.json());
 })
 .then(function(text){
   console.log(text.userID);
 });
}
