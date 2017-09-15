import React from  'react';
import { Link } from 'react-router';

class Header extends React.Component{
  componentDidMount() {
    $('.button-collapse').sideNav();
  }
    render(){
      return(
      <nav>
      <div className="nav-wrapper">
        <Link to="#!" className="brand-logo center">RD</Link>
        <Link to="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></Link>
        <ul className="right hide-on-med-and-down">
          <li><Link to="sass.html">Sass</Link></li>
          <li><Link to="badges.html">Components</Link></li>
          <li><Link to="collapsible.html">Javascript</Link></li>
          <li><Link to="mobile.html">Mobile</Link></li>
        </ul>
        <ul className="side-nav" id="mobile-demo">
          <li><Link to="sass.html">Sass</Link></li>
          <li><Link to="badges.html">Components</Link></li>
          <li><Link to="collapsible.html">Javascript</Link></li>
          <li><Link to="mobile.html">Mobile</Link></li>
        </ul>
      </div>
    </nav>
    );
  }
}

export default Header;
