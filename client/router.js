import React from "react";
import { Routes, Route } from "react-router-dom";

// importing component files
import Login from "./components/Login.jsx";
import Board from "./components/Board.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Signup from "./components/Signup.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard/:name" element={<Dashboard />} />
      <Route path="/Dashboard/:name/:id" element={<Board />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default Router;
