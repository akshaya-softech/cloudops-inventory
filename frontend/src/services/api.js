import axios from 'axios';

// Use HTTP not HTTPS for ALB
//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://cloudops-inventory-alb-558045272.eu-central-1.elb.amazonaws.com/api';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://d2qvf4eug1nlfb.cloudfront.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getStats: () => api.get('/inventory/stats'),
};

export const healthService = {
  getHealth: () => api.get('/health'),
  getMetrics: () => api.get('/health/metrics'),
  getAuditLogs: (limit = 20) => api.get(`/health/audit?limit=${limit}`),
};

export default api;