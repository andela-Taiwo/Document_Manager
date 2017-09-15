import React from 'react';
import {browserHistory} from 'react-router';
import axios from 'axios';
import classNames from 'classnames'
import { connect } from 'react-redux';
import toastr from 'toastr';
import * as userRequestAction from '../../Api/docManagerAPI'

class SignUpForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userName: '',
      email: '',
      password:'',
      errors: {},
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({errors: {}});
    this.props.signUp(this.state)
    .then(() => {
      this.redirect()
    }, ({ data }) => this.setState({errors: data}),
            Materialize.toast('All fields are required', 4000) )
    .catch(({ response }) => {
      Materialize.toast('I am a toast', 4000)
      console.log('hdgjhjkldfl;glhjg eororororororo',response)
    })
  }

  redirect(){
    Materialize.toast('Successfully signed up', 4000)
    browserHistory.push('/dashboard');
    console.log('inside redirect',this.props)
  }

  handleChange(e){
    this.setState({[e.target.name] : e.target.value });

  }
  render(){

    if (this.props.userInfo[0]) {
      localStorage.setItem('userToken', this.props.userInfo[0].data.token);
      // console.log('========',this.props.userInfo[0].data.token);
    }
    const { errors } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <legend> SIGNUP </legend>
        <div className={classNames('form-group', {'has-error': errors.userName})} >
          <label>
            userName:
            <input
              type="text"
              value = {this.state.userName}
              onChange={this.handleChange}
              name = "userName"
              className={classNames('form-group', {'has-error': errors.userName})}
              />
              { errors.userName && <span className="errorMessage"> {errors.userName.errorMessage} </span>}
          </label>
        </div>

        <div className="form-group">
        <label>
          email:
          <input type="email"
            onChange={this.handleChange}
            value = {this.state.email}
            name = "email"
            />
            { errors.email && <span className="errorMessage"> {errors.email.errorMessage} </span>}
        </label>
        </div>

        <div className="form-group">
          <label>
            Password:
            <input type="password"
              onChange={this.handleChange}
              value = {this.state.password}
              name = "password"
              />
              { errors.password && <span className="errorMessage"> {errors.password.errorMessage} </span>}
          </label>
        </div>

        <div className="form-group">
          <input type="submit" value="Submit"  className="btn btn-default"/>
        </div>

      </form>

    );
  }
}
function mapStateToProps(state) {
  return{userInfo: state.userInfo}
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (url) => dispatch(userRequestAction.registerUser(url))
    };
};
// export default HomePage;
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)
