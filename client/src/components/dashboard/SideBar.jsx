import React from 'react';
import { Link } from 'react-router';

class SideBar extends React.Component{
  componentDidMount() {
    $('.button-collapse').sideNav();
  }
  render(){
    console.log('sidebar',localStorage.getItem('message'));
      return (
    <div className="sidebar center">
    <ul id="slide-out" className="side-nav">
  <li><div className="user-view">
    <div className="background">
      <img src="images/office.jpg" />
    </div>
    <a href="#!user"><img className="circle" src="images/yuna.jpg" /></a>
    <a href="#!name"><span className="white-text name">John Doe</span></a>
    <a href="#!email"><span className="white-text email">jdandturk@gmail.com</span></a>
  </div></li>
  <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
  <li><a href="#!">Users</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Update Profile</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">View Users</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">View a User</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Delete Account</a></li>
  <li><a href="#!">Documents</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Create Document</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Update a document</a></li>
  <li><div className="divider"></div></li>
  <li>
  <Link
    to="/dashboard/:documents/" >
  View Documents</Link>
  </li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Delete Document</a></li>
  <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>
<a href="#" data-activates="slide-out" className="button-collapse"><i className="material-icons">menu</i></a>

</div>
  )
  }
}
export default SideBar;
