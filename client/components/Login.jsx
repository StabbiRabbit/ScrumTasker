import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import "../styles/Login.scss";

function Login() {
  // state control of username and password
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);

  // On initial page load, check if the session is valid; if so, redirect to dashboard;
  useEffect(() => validateSessionAndSkipLogin(), []);

  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    if (username === "" || password === "") {
      return;
    }
    fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
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
          navigate("/dashboard");
        } else if (response.status >= 500 && response.status <= 599) {
          // If the response is comes back as bad, clear the username and password fields
          setLoginAttempted(true);
          setUsername("");
          setPassword("");
        }
      })
      .catch((err) => console.log(err));
  };

  const validateSessionAndSkipLogin = () => {
    fetch("http://localhost:3000/login", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate("./dashboard");
      } else {
        return;
      }
    });
  };

  return (
    <div className="center">
      <h1>User Login</h1>
      <form onSubmit={onSubmit}>
        {loginAttempted ? (
          <h4 className="wrong-input-message">
            Incorrect username or password. Please try again or sign up for a
            new account
          </h4>
        ) : (
          <h4>Enter your details below to log in to your account</h4>
        )}
        <div className="txt_field">
          <label htmlFor="name" className="form-label">
            Username
          </label>
          <input
            className="form-input"
            onChange={onChangeUsername}
            value={username}
            type="text"
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
        <button className="login-button">Log in</button>
      </form>
    </div>
  );
}

export default Login;
