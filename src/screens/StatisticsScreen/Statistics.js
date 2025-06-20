import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function Statistics() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">Statistics</h1>
        
        <div className="stats-grid">
          <div 
            className="stat-card" 
            onClick={() => navigate('/city-stats')}
          >
            <h3>CityCollects Stats</h3>
          </div>
          
          <div 
            className="stat-card" 
            onClick={() => navigate('/avg-stats')}
          >
            <h3>Average Stats</h3>
          </div>
          
          <div 
            className="stat-card" 
            onClick={() => navigate('/city-statistics')}
          >
            <h3>Keepers Stats</h3>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  return (
    <div className="footer">
      <button className="footer-button" onClick={() => navigate('/colony-search')}>
        <span>ColonySearch</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/check-messages')}>
        <span>Messages</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/add-participant')}>
        <span>AddUser</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/admin-info')}>
        <span>Home</span>
      </button>
    </div>
  );
}