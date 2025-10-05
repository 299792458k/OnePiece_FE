import axios from 'axios';

// base url
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5215';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// api của ứng dụng
export const treasureHuntAPI = {
  // Giải bài toán và lưu vào database
  solve: async (data) => {
    const response = await api.post('/map/solve', data);
    return response.data;
  },

  // Lưu input bai toan
  save: async (data) => {
    const response = await api.post('/map', data);
    return response.data;
  },

  // Lấy lịch sử các bài toán đã giải
  getHistory: async () => {
    const response = await api.get('/map');
    return response.data;
  },

  // Lấy chi tiết một bài toán
  getById: async (id) => {
    const response = await api.get(`/map/${id}`);
    return response.data;
  },

  // Xóa một bài toán
  delete: async (id) => {
    const response = await api.delete(`/map/${id}`);
    return response.data;
  },
};

export default api;
