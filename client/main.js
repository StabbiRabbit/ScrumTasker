import React from "react";
import { BrowserRouter, MemoryRouter, Link } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";


import store from "./store.js";
import Router from "./router.js";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Board from "./components/Board.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <nav className="directions">
        <li>
          <Link to="/">Log in</Link>
        </li>
        <li>
          <Link to="/signup">sign up</Link>
        </li>
        <li>
          <Link to="/dashboard">dashboard</Link>
        </li>
        <li>
          <Link to="/board">board</Link>
        </li>
      </nav>
      {/* <Login /> */}
      {/* <Dashboard /> */}
      {/* <Board /> */}
      <Router />
    </BrowserRouter>
  </Provider>
);
