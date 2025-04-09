import React, { useState } from "react";
import "./login.css";
import logo from "../multimedia/logo_5aremix.png";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Api.js"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError("Email o contraseña incorrectos");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Cloudy Logo" className="logo" />
        <h1 className="title">Acceder</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="email">Dirección email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">Acceder</button>
        </form>

        <div className="options">
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;