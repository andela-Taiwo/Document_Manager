import React from 'react';
import Header from './Header/Header.jsx';
import SideBar from './dashboard/SideBar.jsx';

import PropTypes from 'prop-types';

class App extends React.Component{
  render(){
    return(
      <div className="">
        <div className="NavBar">
          <Header />

        </div>
        <div className="">
          <div className="row">

          <div className="col s2">
            { localStorage.getItem('userToken') &&  <SideBar/>}
          </div>

          <div className="col s10">
            {this.props.children}
          </div>

          </div>


        </div>
      </div>

    );
  }
}
App.propTypes = {
  children: PropTypes.object.isRequired
}
export default App;
