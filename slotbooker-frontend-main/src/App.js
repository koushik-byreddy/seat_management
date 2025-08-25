// src/App.js
import React from "react";
import GlobalStyle from "./globalStyles";
import Auth from "./components/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="room/:id" element={<Room />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
