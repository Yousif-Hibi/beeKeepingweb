import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function CheckerInfoScreen() {
    const navigate = useNavigate();
    
    return (
      <div className="checker-background">
        <div className="checker-container">
          <h1 className="checker-title">Welcome, Checker!</h1>
          
          <button 
            className="checker-button" 
            onClick={() => navigate('/colony-search')}
          >
            Colony Search
          </button>
          
          <button 
            className="checker-button" 
            onClick={() => navigate('/check-messages')}
          >
            Check Messages
          </button>
          
          <button 
            className="checker-button" 
            onClick={() => navigate('/add-participant')}
          >
            Add Participant
          </button>
        </div>
      </div>
    );
}

export default CheckerInfoScreen;