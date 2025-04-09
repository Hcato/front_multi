import React from "react";
import "./Cloudy.css";
import logo from "../multimedia/logo_5aremix.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="cloudy-navbar">
      <div className="cloudy-logo">
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
    <img src={logo} alt="Cloudy Logo" />
    <span>Cloudy</span>
  </Link>
      </div>
      <ul className="cloudy-nav-links">
        <li>
          <Link to="/plans">Planes</Link>
        </li>
        <li>
          <Link to="/support">Soporte técnico</Link>
        </li>
      </ul>
      <Link to="/login">
        <button className="cloudy-button">Abrir Cloudy</button>
      </Link>
    </nav>
  );
};

export default Navbar;
