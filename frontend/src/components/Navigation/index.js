import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import NoUserProfileButton from './NoUserProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignupFormPage/SignUpFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const [signup, setShowSignup] = useState(false);
  const [login, setLogin] = useState(false);


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
      <NoUserProfileButton setShowSignup={setShowSignup} setLogin={setLogin} />
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
          {signup && <SignUpFormModal setShowSignup={setShowSignup} signup={signup} />}
          {login && <LoginFormModal setLogin={setLogin} login={login} />}
          <li>
            {isLoaded && sessionLinks}
          </li>
        </div>
      </ul>
    </div>
  );
}

export default Navigation;
