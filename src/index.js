import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres medir el rendimiento de tu app, pasa una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o envía a un servicio de análisis. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals();