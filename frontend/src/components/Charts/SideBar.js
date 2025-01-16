

import React from "react";
import { Link } from "react-router-dom";
import "../../css/style.css"; // Import the styling file

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Analytics Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" className="sidebar-link">
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/budgetPlanner" className="sidebar-link">
            <span className="sidebar-icon">📣</span>
            <span className="sidebar-text">Budget Planner</span>
          </Link>
        </li>
        {/* <li>
          <Link to="/regions" className="sidebar-link">
            <span className="sidebar-icon">🌎</span>
            <span className="sidebar-text">Regions</span>
          </Link>
        </li> */}
        <li>
          <Link to="/performance" className="sidebar-link">
            <span className="sidebar-icon">📈</span>
            <span className="sidebar-text">Performance</span>
          </Link>
        </li>
        <li>
          <Link to="/predictions" className="sidebar-link">
            <span className="sidebar-icon">🔮</span>
            <span className="sidebar-text">Predictions</span>
          </Link>
        </li>
        <li>
          {/* <Link to="/reports" className="sidebar-link">
            <span className="sidebar-icon">📄</span>
            <span className="sidebar-text">Reports</span>
          </Link> */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
