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
          if (data && data.errors) setErrors(data.errors);
        });
      console.log(errors, 'these are errors');
      if(!errors.length) window.alert(`Successfully Logged In - Welcome to Earthbnb!`);
    }

    return (
      <div className='login-modal'>
        <div className="login-form-header">
          <h3>Log In</h3>
        </div>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
         className='login-form-wrapper'>
          <h2>Welcome to Earthbnb</h2>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
            className='username-email-input'
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className='password-input'
          />
        </label>
        <button type="submit">Log In</button>
        <button
          onClick={() => (dispatch(sessionActions.login({
            credential: "Demo-lition",
            password: "password"
          })), window.alert('Successfully Logged In - Welcome to Earthbnb!'))}
        >
          Demo User
          </button>
      </form>
      </div>

    );
}

export default LoginForm;
