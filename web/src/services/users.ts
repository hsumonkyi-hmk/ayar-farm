import api from './api';

const usersService = {
  async getAll() {
    const res = await api.get('/users');
    return res.data;
  },
};

export default usersService;
