import React from 'react';

class Login extends React.Component{

  handleSubmit(){

  }
  handleChange(){

  }

  render(){
    return(
      <div>
      <form onSubmit={this.handleSubmit}>
      <legend> LOGIN </legend>
        <label>
          email:
          <input type="text"  onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="text"  onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" className="btn btn-default" />
      </form>
      </div>
    );
  }
}
export default Login
