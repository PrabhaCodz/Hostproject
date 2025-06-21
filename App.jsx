// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Comments from "./components/Comments";
import Youtube from "./components/YouTube";
import Profile from "./components/Profile";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/youtube" element={<Youtube/>} />
        <Route path="/profile" element={<Profile/>} />
        
      </Routes>
    </Router>
  );
};

export default App;