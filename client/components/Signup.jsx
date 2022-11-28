import React, {useState, useEffect} from "react";

function Signup() {

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
  }
  
  return (
    <div className="center">
      <h1>Sign Up</h1>

      <form onSubmit={onSubmit} >
        <h4>Hey, Enter your details to get signed up</h4>
        <div className="txt_field">
          
          <label htmlFor='name' className="form-label">Username
          </label>
          <span></span>
          <input
            className="form-input"
            onChange={onChangeName}
            value={userName}
            type="text" />
          
        </div>
        <div className="txt_field">
          <label className="form-label">Password</label>
          <span></span>
          <input
            className="form-input"
            onChange={onChangePW}
            value={password}
            type="text" />
          </div>
          <button className="login-button">Sign Up</button> 
        
      </form>
      

      {/* directing to the signup page. */}
      {/* <button onClick={navigate('/signup')}>Sign up</button> */}
      

    </div>
  )
}

export default Signup;
