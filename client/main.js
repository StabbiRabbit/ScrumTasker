import React from "react";
import { BrowserRouter, MemoryRouter, Link } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import store from "./store.js";
import Router from "./router.js";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Board from "./components/Board.jsx";
import Signup from "./components/Signup.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <MemoryRouter>
      <nav className="directions">
        <div className="leftNav">
          <button className="navButton">
            <Link to="/" className="link-text">
              Sign In
            </Link>
          </button>
          <button className="navButton">
            <Link to="/signup" className="link-text">
              Sign Up
            </Link>
          </button>
        </div>
        <div className="rightNav">
          <button className="navButton">
            <Link to="dashboard" className="link-text">
              Dashboard
            </Link>
          </button>
        </div>
      </nav>
      {/* <Signup /> */}
      {/* <Login /> */}
      {/* <Dashboard /> */}
      {/* <Board /> */}
      <Router />
    </MemoryRouter>
  </Provider>
);
