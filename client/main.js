import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Page from "./Page.js";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <nav>
      <div className="leftNav">
        <Link to="/">
          <button className="navButton">Sign In</button>
        </Link>
        <Link to="/signup">
          <button className="navButton">Sign Up</button>
        </Link>
      </div>
      <div className="rightNav">
        <Link to="dashboard">
          <button className="navButton">Dashboard</button>
        </Link>
      </div>
    </nav>
    <Page />
  </BrowserRouter>
);
