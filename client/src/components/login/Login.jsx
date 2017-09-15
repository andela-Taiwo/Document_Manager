import React from 'react';
import {browserHistory} from 'react-router';
import { connect } from 'react-redux';
import * as userRequestAction from '../../Api/docManagerAPI'
class Login extends React.Component{

  constructor(props){
  	super(props);
  	this.state = {
      email: '',
      password: '',
      errors: {},

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({errors: {}});
    this.props.login(this.state)
    .then(() => {
      this.redirect()
    }, ({ data }) => this.setState({errors: data}),
            Materialize.toast('All fields are required', 4000) )
    .catch(({ response }) => {
      Materialize.toast('I am a toast', 4000)
      console.log('hdgjhjkldfl;glhjg eororororororo',response)
    })
  }
  handleChange(e){
    this.setState({[e.target.name] : e.target.value });
  }

  redirect(){
    Materialize.toast('Successfully logged in', 4000)
    browserHistory.push('/dashboard');
    console.log('inside redirect',this.props)
  }

  render(){
    if (this.props.userLogin[0]) {
      console.log('========',this.props.userLogin);
      localStorage.setItem('userToken', this.props.userLogin[0].data.token);
      localStorage.setItem('message',this.props.userLogin[0].data.message);
    }
    const { errors } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <legend> LOGIN </legend>
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
  return{userLogin: state.userLogin}
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (url) => dispatch(userRequestAction.loginUser(url))
    };
};
// export default HomePage;
export default connect(mapStateToProps, mapDispatchToProps)(Login)
