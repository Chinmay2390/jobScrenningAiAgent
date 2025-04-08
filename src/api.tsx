// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobscrenningaiagent.onrender.com/', // adjust if hosted
});

export default api;
