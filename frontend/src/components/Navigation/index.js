import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import NoUserProfileButton from './NoUserProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      // <>
      //   <LoginFormModal />
      //   <NavLink to="/signup">Sign Up</NavLink>
      // </>
      <NoUserProfileButton />
    );
  }

  return (

    <div className='nav-bar'>
      <ul className="nav-list">
        <li>
          <NavLink exact to="/"><img src="https://i.imgur.com/79fkJrb.png" className="home-logo"></img></NavLink>
        </li>

        <div className='right-nav-items'>
          <li>
            <NavLink className="host-a-spot" to='/spots/new'>Host a Spot</NavLink>
          </li>

          <li>
            {isLoaded && sessionLinks}
          </li>
        </div>
      </ul>
    </div>
  );
}

export default Navigation;
