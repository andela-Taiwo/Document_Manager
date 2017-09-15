import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Login from './login/Login.jsx';
import SignUpForm from './signup/SignUpForm.jsx';
// import {userSignupRequest} from '../actions/SignUpAction';
import { signUp } from '../actions/SignUpAction'

class HomePage extends React.Component {
  render(){
    const {signUp}  = this.props;
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
              <SignUpForm />
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

// HomePage.propTypes= {
//   signUp: PropTypes.func.isRequired,
// }

// function mapStateToProps(state) {
//   return{user: state.SignUpReducer}
// }
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({reducer},dispatch)
// }
export default HomePage;
// export default connect(mapStateToProps)(HomePage)
