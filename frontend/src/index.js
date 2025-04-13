import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './App.css';

// Setup axios defaults
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000'; // Point to your FastAPI backend URL

// For handling axios errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage if token is invalid
      localStorage.removeItem('token');
      // You could also dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);