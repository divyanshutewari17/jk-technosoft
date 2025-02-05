import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App'; // Import the main App component

// Get the root element from your HTML file
const container = document.getElementById('root');

// Create a root for the app
const root = createRoot(container);

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);