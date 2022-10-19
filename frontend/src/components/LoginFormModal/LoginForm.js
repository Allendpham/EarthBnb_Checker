// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './LoginForm.css';

function LoginForm () {
  const dispatch = useDispatch();
   const sessionUser = useSelector(state => state.session.user);
   const [credential, setCredential] = useState('');
   const [password, setPassword] = useState('');
   const [errors, setErrors] = useState([]);

   if (sessionUser) return (
      <Redirect to="/" />
    );



    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      dispatch(sessionActions.login({ credential, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);

            const userEmailInput = document.querySelector('.username-email-input')
            const passwordInput = document.querySelector('.password-input');

            data?.errors.includes('Please provide a valid email or username.') || data?.errors.includes('The provided credentials were invalid.') ?
                userEmailInput.style.border = "2px solid rgb(192, 53, 21)" :
                userEmailInput.style.border = "1px solid rgba(0, 0, 0, 0.4)";

            data.errors.includes('Please provide a password.') || data.errors.includes('The provided credentials were invalid.') ?
                passwordInput.style.border = "2px solid rgb(192, 53, 21)" :
                passwordInput.style.border = "1px solid rgba(0, 0, 0, 0.4)";
          } 
        });

      // if(!errors.length) window.alert(`Successfully Logged In - Welcome to Earthbnb!`);
    }

    return (
      <div className='login-modal'>
        <div className="login-form-header">
          <h3>Log In</h3>
        </div>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
         className='login-form-wrapper'>
          <h2>Welcome to Earthbnb</h2>
        <ul className='errors-list'>
          {errors.map((error, idx) => <li className='errors-list-item' key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
        </ul>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            className='username-email-input'
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className='password-input'
          />
        </label>
        <button type="submit">Log In</button>
        <button
          onClick={() => (dispatch(sessionActions.login({
            credential: "Demo-lition",
            password: "password"
          })), setCredential('Demo-lition'), setPassword('password'), window.alert('Successfully Logged In - Welcome to Earthbnb!'))}
        >
          Demo User
          </button>
      </form>
      </div>

    );
}

export default LoginForm;
