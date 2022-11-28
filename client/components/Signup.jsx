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
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChangeName}
          value={userName}
          type="text"
          placeholder="username" />
        <input
          onChange={onChangePW}
          value={password}
          type="text"
          placeholder="password" />
        <button>Login</button>
      </form>


      {/* directing to the signup page. */}
      {/* <button>
        <Link to="/signup" >signup</Link>
      </button> */}

    </div>
  )
}

export default Signup;
