// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Ajuste conforme sua URL do Rails
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;