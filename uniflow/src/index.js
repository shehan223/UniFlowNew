
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MedicalAvailabilityProvider } from './context/MedicalAvailabilityContext';
import { ToastProvider } from './context/ToastContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <MedicalAvailabilityProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MedicalAvailabilityProvider>
  </BrowserRouter>
);
