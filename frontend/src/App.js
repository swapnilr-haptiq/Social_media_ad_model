// frontend/src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UploadCSV from "./components/UploadCSV";
import Dashboard from "./components/Dashboard";
import Performance from "./components/Charts/Performance";
import BudgetPlanner from "./components/Charts/BudgetPlanner";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/upload" element={<UploadCSV />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/budgetPlanner" element={<BudgetPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
