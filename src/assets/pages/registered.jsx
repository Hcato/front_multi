import React, { useState, useEffect } from "react";
import "./registered.css";
import logo from "../multimedia/logo_5aremix.png";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../Api.js"; 
import { getTokenOnly } from "../../firebase-config.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-solicitar permisos de notificación al cargar el componente
    getTokenOnly().catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Generar token2 justo antes de enviar el formulario
      const token2 = await getTokenOnly();
      if (!token2) {
        console.warn("No se pudo obtener token de notificaciones, continuando sin él");
      }

      await registerUser({
        ...formData,
        token2: token2 || "", // Envía el token2 o string vacío si no se obtuvo
      });

      alert("Cuenta creada con éxito");
      navigate("/");
    } catch (err) {
      setError(err.message || "Error en el registro");
      console.error("Error en el registro:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-navbar">
        <Link 
          to="/" 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <img src={logo} alt="Cloudy Logo" />
          <span>Cloudy</span>
        </Link>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        {error && <div className="error-message">{error}</div>}

        <label>
          Dirección email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </label>

        <label>
          Nombre de usuario
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Imagen de perfil (opcional)
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Envíame informe, ofertas y noticias de Cloudy</span>
        </label>

        <button 
          type="submit" 
          className="cloudy-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="login-redirect">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" style={{ color: "orange" }}>Acceder</Link>
        </p>
      </form>

      <footer className="register-footer">© 2025 Cloudy</footer>
    </div>
  );
};

export default Register;