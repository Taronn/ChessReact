import api from './api';

export const registerUser = async userData =>
  await api.post('api/registration', userData);
