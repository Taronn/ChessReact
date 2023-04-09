import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chesstaron.azurewebsites.net/',
  withCredentials: true,
});

export default api;
