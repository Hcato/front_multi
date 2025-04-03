import React from 'react';
import Header from '../components/Header';
import PlansContainer from '../components/PlansContainer';


const PlansPage = () => {
  return (
    <div className="app" style={{ background: '#111', color: 'white', minHeight: '100vh' }}>
      <Header />
      <PlansContainer />

    </div>
  );
};

export default PlansPage;