import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./page/User";
import Roles from "./page/Role";
import Permissions from "./page/Permission";
import HomePage from "./page/Home";
import "./App.css"
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/permissions" element={<Permissions />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
