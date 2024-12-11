import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './root';
import { BrowserRouter } from 'react-router';

hydrateRoot(
  document.getElementById('root')!, 
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
