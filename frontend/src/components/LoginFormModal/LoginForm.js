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
      return dispatch(sessionActions.login({ credential, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }

    return (
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
         className='login-form-wrapper'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button
          onClick={() => dispatch(sessionActions.login({
            credential: "Demo-lition",
            password: "password"
          }))}
        >
          Demo User
          </button>
      </form>
    );
}

export default LoginForm;
