import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);

  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);
  const onSignUpSubmit = (event) => {
    event.preventDefault();
    if (username === "" || password === "") {
      return;
    }
    setUsername("");
    setPassword("");
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          setSignup(true);
          navigate("/dashboard");
        } else if (response.status >= 500 && response.status <= 599) {
          // If the response is comes back as bad, clear the username and password fields
          setUsername("");
          setPassword("");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="center">
      <h1>Sign Up</h1>
      <form onSubmit={onSignUpSubmit}>
        {signup ? (
          <h4>Your account has been created</h4>
        ) : (
          <h4>Enter your details below to sign up</h4>
        )}
        <div className="txt_field">
          <label htmlFor="name" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-input"
            onChange={onChangeUsername}
            value={username}
          />
        </div>
        <div className="txt_field">
          <label className="form-label">Password</label>
          <span></span>
          <input
            className="form-input"
            onChange={onChangePassword}
            value={password}
            type="password"
          />
        </div>
        <button className="login-button" onClick={onSignUpSubmit}>
          Sign Up
        </button>
      </form>
      {/* <button onClick={navigate("/signup")}>Sign up</button> */}
    </div>
  );
}

export default Signup;
