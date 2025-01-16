import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "../../css/style.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AdVision</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li>
          {/* <Link to="/ad-performance" className="nav-link">
            Ad Analytics
          </Link> */}
        </li>
        <li>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/logout" className="nav-link logout-link">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
