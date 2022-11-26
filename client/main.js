import React from "react";
import { BrowserRouter } from "react-router-dom";
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
      {/* <Login /> */}
      <Dashboard />
      {/* <Board /> */}
    </BrowserRouter>
  </Provider>
);
