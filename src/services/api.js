import axios from 'axios';

const api = axios.create({
  baseURL: 'http://taronn-001-site1.etempurl.com/',
  withCredentials: true,
});

export default api;
