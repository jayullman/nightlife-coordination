import React from 'react';

const Header = (props) => (
  <header>
    <span
      onClick={props.isLoggedIn ? props.logOut : props.logIn}
      className='loginoutLink'
    >
      {props.isLoggedIn ? 'Log out' : 'Log in'}
    </span>
      <h1>The Nightlife App <i className="fa fa-moon-o" aria-hidden="true"></i></h1>
  </header>
);

export default Header;
