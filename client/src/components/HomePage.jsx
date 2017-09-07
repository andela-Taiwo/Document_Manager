import React from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
class HomePage extends React.Component {
  render(){
    return(
      <div>
        <div className="">
          <div className="row">
            <div className="col l12 center">
              <h1>Reliable DOCS</h1>
            </div>
          </div>
          <div className="row">
            <div className="card-panel col l6">
              <SignUp />
            </div>
            <div className="card-panel small col l6">
              <Login />
            </div>
          </div>
       </div>
       </div>


    );
  }
}

export default HomePage;
