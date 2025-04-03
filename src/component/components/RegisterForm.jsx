import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { auth, generationToken } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    subscribe: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Registro en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Obtener token de notificaciones
      const firebaseNotificationToken = await generationToken();

      // Enviar datos al backend
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: formData.username,
          email: formData.email,
          password: formData.password,
          token2: firebaseNotificationToken,
          subscribe: formData.subscribe
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error en el registro");
      }

      navigate('/login', { state: { registrationSuccess: true } });
      
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="form-title">Crear cuenta</h2>
        
        <div className="form-input-group">
          <label className="form-label">Usuario</label>
          <input
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Crea una contraseña segura"
          />
        </div>

        <div className="form-checkbox-group">
          <input
            name="subscribe"
            type="checkbox"
            id="subscribe-checkbox"
            checked={formData.subscribe}
            onChange={handleInputChange}
            className="form-checkbox"
          />
          <label htmlFor="subscribe-checkbox" className="form-checkbox-label">
            Recibir noticias y ofertas
          </label>
        </div>

        {error && <div className="form-error-message">{error}</div>}

        <button 
          type="submit" 
          className="form-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Registrar'}
        </button>

        <div className="form-footer">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            className="form-link"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;