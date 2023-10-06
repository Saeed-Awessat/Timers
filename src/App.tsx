import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./components/TimersList";

function App() {
  return (
    <div className="App">
      <h1>Timers List</h1>
      <Dashboard />
    </div>
  );
}

export default App; 
