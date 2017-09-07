import React from 'react';

class SignUp extends React.Component{

  handleSubmit(){

  }
  handleChange(){

  }
  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <legend> SIGNUP </legend>
        <label>
          Name:
          <input type="text" onChange={this.handleChange} />
        </label>
        <label>
          email:
          <input type="text"  onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="text"  onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit"  className="btn btn-default"/>
      </form>

    );
  }
}
export default SignUp
