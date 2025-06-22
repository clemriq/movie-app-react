import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import logoWhite from './assets/images/logo-white.png';

// Configuration du favicon
const setFavicon = () => {
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = logoWhite;
  document.getElementsByTagName('head')[0].appendChild(link);
  
  // Titre de l'application
  document.title = "L'écran total";
};

setFavicon();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);