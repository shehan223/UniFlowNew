import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MedicalAvailabilityProvider } from './context/MedicalAvailabilityContext';
import './index.css';
import './App.css';
import './animations.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <MedicalAvailabilityProvider>
      <App />
    </MedicalAvailabilityProvider>
  </BrowserRouter>
);
