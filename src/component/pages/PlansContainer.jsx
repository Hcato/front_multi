import React from 'react';
import { useNavigate } from 'react-router-dom';
import Plan from '../components/Plan';
import './PlansContainer.css';

const PlansContainer = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      title: 'Básico',
      features: [
        '#1 Instalación, configuración y acceso al equipo meteorológico.',
        '#2 Compartir el acceso a un máximo de 10 personas.',
        '#3 Un mes de garantía',
      ],
      price: 399,
    },
    {
      title: 'Básico +',
      features: [
        '#1 Todo lo del plan Básico.',
        '#2 Aumente la cantidad de personas a un máximo de 100 para el acceso a tu estación.',
        '#3 La garantía aumenta a un año.',
      ],
      price: 899,
    },
  ];

  return (
    <div className="plans-page-container">
      <div className="plans-background">
        <div className="plans-overlay"></div>
        
        {/* Botón de volver fuera del contenedor de cards */}
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          ← Volver
        </button>
        
        <div className="plans-wrapper">
          {plans.map((plan, index) => (
            <Plan key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansContainer;