import api from './api';

export default class authService {
  static async login(loginData) {
    return await api.post('api/auth/login', loginData);
  }

  static async logout() {
    return await api.get('api/auth/logout');
  }

  static async getUser() {
    return await api.get('api/auth/user');
  }
}
