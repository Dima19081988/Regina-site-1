import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import './styles/global.css'; 
import 'normalize.css';
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);