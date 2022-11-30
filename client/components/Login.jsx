import React, { useState, useEffect } from "react";
// react router linking for signup and login
import { Link, useNavigate } from "react-router-dom";;
import "../styles/Login.scss";

const { BACKEND_URL } = process.env;;

function Login() {
  // state control of username and password
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tried, setTried] = useState(false);

  const onChangeName = (event) => setUsername(event.target.value);
  const onChangePW = (event) => setPassword(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    if (username === "" || password === "") {
      return;
    }
    fetch(`${BACKEND_URL}/login`, {
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
        // console.log(response.status)
        if (response.status === 200) {
          navigate("/dashboard");
        } else if (response.status >= 500 && response.status <= 599) {
          // If the response is comes back as bad, clear the username and password fields
          setTried(true);
          setUsername("");
          setPassword("");
        }
      })
      .catch((err) => console.log(err));
  };

  const skipLoginIfValidSession = () => {
    fetch(`${BACKEND_URL}/login`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.status === 200) {
        navigate("./dashboard");
      } else {
        return;
      }
    });
  };

  useEffect(() => {
    skipLoginIfValidSession();
  }, []);

  return (
    <div className='center'>
      <h1>User Login</h1>
      <form onSubmit={onSubmit}>
        {tried ? (
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
          <span></span>
          <input
            className="form-input"
            onChange={onChangeName}
            value={username}
            type="text"
          />
        </div>
        <div className="txt_field">
          <label className="form-label">Password</label>
          <span></span>
          <input
            className="form-input"
            onChange={onChangePW}
            value={password}
            type="password"
          />
        </div>
        <button className="login-button">Sign in</button>
      </form>
    </div>
  );
}

export default Login;
