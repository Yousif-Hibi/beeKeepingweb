import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function AdminInfoScreen() {
  const navigate = useNavigate();

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">Welcome, Admin!</h1>
        
        <div className="row-container">
          <button 
            className="square" 
            onClick={() => navigate('/colony-search')}
          >
            Colony Search
          </button>
          <button 
            className="square" 
            onClick={() => navigate('/check-messages')}
          >
            Check Messages
          </button>
        </div>
        
        <div className="row-container">
          <button 
            className="square" 
            onClick={() => navigate('/add-participant')}
          >
            Add Participant
          </button>
          <button 
            className="square" 
            onClick={() => navigate('/statistics')}
          >
            Statistics
          </button>
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
      <button className="footer-button" onClick={() => navigate('/statistics')}>
        <span>Stats</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/admin-info')}>
        <span>Home</span>
      </button>
    </div>
  );
}