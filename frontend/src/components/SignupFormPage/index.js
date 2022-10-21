// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
   // const history = useHistory(); Redirect to home page after signing up??
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password, firstName, lastName }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);

            const inputs = document.getElementsByTagName('input');

            data.errors.includes("Please provide a valid email.") || data.errors.includes("Email has a character limit of 255.") || data.errors.includes('email must be unique') ?
              inputs[0].style.border = "2px solid rgb(192, 53, 21)" :
              inputs[0].style.border = "1px solid rgba(0, 0, 0, 0.4)";

            data.errors.includes("Please provide a username with at least 4 characters.")|| data.errors.includes("Username has a character limit of 255.") || data.errors.includes('username must be unique') ?
              inputs[1].style.border = "2px solid rgb(192, 53, 21)" :
              inputs[1].style.border = "1px solid rgba(0, 0, 0, 0.4)";

            data.errors.includes("Please provide a first name.") || data.errors.includes("First name has a character limit of 255.") ?
              inputs[2].style.border = "2px solid rgb(192, 53, 21)" :
              inputs[2].style.border = "1px solid rgba(0, 0, 0, 0.4)";

            data.errors.includes("Please provide a last name.") || data.errors.includes("Last name has a character limit of 255.") ?
              inputs[3].style.border = "2px solid rgb(192, 53, 21)" :
              inputs[3].style.border = "1px solid rgba(0, 0, 0, 0.4)";

            data.errors.includes("Password must be 6 characters or more.") || data.errors.includes("Password has a character limit of 255.") ?
              inputs[4].style.border = "2px solid rgb(192, 53, 21)" :
              inputs[4].style.border = "1px solid rgba(0, 0, 0, 0.4)";


              inputs[5].style.border = "1px solid rgba(0, 0, 0, 0.4)"
          }
        });
    } 
    const inputs = document.getElementsByTagName('input');
    inputs[5].style.border = "2px solid rgb(192, 53, 21)"
    return setErrors(['Confirm Password field must be the same as the Password field.']);

  };

  return (
    <div className="sign-up-form-modal">
        <div className="signup-form-header">
          <h3>Sign Up</h3>
        </div>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className='signup-form-wrapper'>
        <h2>Welcome to Earthbnb</h2>
        <ul className='errors-list'>
          {errors.map((error, idx) => <li key={idx}><i className='fa fa-exclamation-circle' />  {error}</li>)}
        </ul>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </label>
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </label>
        <label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </label>
        <label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
