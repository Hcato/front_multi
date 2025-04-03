import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const firebaseToken = await userCredential.user.getIdToken();

      // Verificación con el backend
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
      const backendResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`
        }
      });

      if (!backendResponse.ok) {
        throw new Error(await backendResponse.text());
      }

      // Almacenar token JWT del backend
      const { jwtToken } = await backendResponse.json();
      localStorage.setItem('userAuthToken', jwtToken);
      
      // Redirección tras login exitoso
      navigate('/dashboard');
      
    } catch (authError) {
      console.error("Error en autenticación:", authError);
      setLoginError(authError.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page-container">
      <form className="auth-login-form" onSubmit={handleUserLogin}>
        <h1 className="auth-form-title">Acceder</h1>
        <div className="auth-input-group">
          <label className="auth-input-label">Dirección email</label>
          <input 
            type="email" 
            required 
            value={loginEmail} 
            onChange={(e) => setLoginEmail(e.target.value)}
            className="auth-input-field"
            placeholder="Ingrese su correo electrónico" 
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Contraseña</label>
          <input 
            type="password" 
            required 
            value={loginPassword} 
            onChange={(e) => setLoginPassword(e.target.value)}
            className="auth-input-field"
            placeholder="Ingrese su contraseña" 
          />
        </div>

        {loginError && <div className="auth-error-message">{loginError}</div>}

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Iniciando sesión...' : 'Acceder a mi cuenta'}
        </button>

        <div className="auth-form-footer">
          <a href="/register" className="auth-form-link">¿No tienes cuenta? Regístrate ahora</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
