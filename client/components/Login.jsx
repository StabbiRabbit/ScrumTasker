import React, { useState } from "react";

// react router linking for signup and login
import { Link, useNavigate } from "react-router-dom"

import "../styles/Login.scss"

function Login() {

  // state control of username and password
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onChangeName = (event) => setUserName(event.target.value);
  const onChangePW = (event) => setPassword(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    if (userName === "" || password === "") {
      return;
    }

    setUserName("");
    setPassword("");

    const userApi = ""

    fetch(userApi, {
      method: "POST",
    })
      .then(response => response.json())
      .then(data => {
        setUserName(data.body.username)
        setPassword(data.body.password)
      })
     .catch(err => console.log(err))
    console.log('pressin')
  }



  return (
    <div>
      <form onSubmit={onSubmit} className="form">
        <h5>Login</h5>
        <div className="form-row">
          <label htmlFor='name' className="form-label">Username</label>
          <input
            className="form-input"
            onChange={onChangeName}
            value={userName}
            type="text" />
          <label className="form-label">Password</label>
          <input
            className="form-input"
            onChange={onChangePW}
            value={password}
            type="text" />
          <button>Login</button>
        </div>
      </form>

      {/* directing to the signup page. */}
      {/* <button onClick={navigate('/signup')}>Sign up</button> */}
      <button><Link to='/signup'>signup</Link></button>

    </div>
  )
}

export default Login;

