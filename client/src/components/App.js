import React from 'react';
import Header from './Header/Header.jsx';
import PropTypes from 'prop-types';

class App extends React.Component{
  render(){
    return(
      <div className="">
        <div className="NavBar">
          <Header />
        </div>
        <div>
          {this.props.children}
        </div>
      </div>

    );
  }
}
App.propTypes = {
  children: PropTypes.object.isRequired
}
export default App;
