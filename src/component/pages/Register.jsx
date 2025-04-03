import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <div className="container">
      <div className="inner-container">
        <RegisterForm /> {/* Usa el componente RegisterForm aquí */}
      </div>
    </div>
  );
};

export default Register;
