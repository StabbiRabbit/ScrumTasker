import React from "react";
import { Routes, Route } from "react-router-dom";

// importing component files
import Login from "./components/Login.jsx";
import Board from "./components/Board.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Signup from "./components/Signup.jsx";
import NotFound from "./components/NotFound.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/" element={<Dashboard />} />
      <Route path="/board/:id" element={<Board />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
