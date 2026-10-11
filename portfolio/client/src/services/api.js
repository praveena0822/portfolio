import axios from 'axios';

const TOKEN_KEY = 'admin_token';

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid admin session sends the user back to the login page.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.includes('/auth/login') && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// Turns an Axios error into a readable message (including field-level validation details).
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (!error.response) return 'Cannot reach the server. Check your connection and try again.';
  const { message, details } = error.response.data || {};
  if (Array.isArray(details) && details.length) {
    return details.map((d) => (d.field ? `${d.field}: ${d.message}` : d.message)).join(' · ');
  }
  return message || fallback;
}

export default api;

export const portfolioApi = {
  get: () => api.get('/portfolio').then((r) => r.data),
};
export const authApi = {
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};
export const profileApi = {
  getAdmin: () => api.get('/profile/admin').then((r) => r.data),
  update: (body) => api.put('/profile', body).then((r) => r.data),
};
export const resourceApi = (endpoint) => ({
  list: () => api.get(endpoint).then((r) => r.data),
  create: (body) => api.post(endpoint, body).then((r) => r.data),
  update: (id, body) => api.put(`${endpoint}/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`${endpoint}/${id}`).then((r) => r.data),
});
export const messagesApi = {
  send: (body) => api.post('/messages', body).then((r) => r.data),
  list: () => api.get('/messages').then((r) => r.data),
  setRead: (id, read) => api.patch(`/messages/${id}/read`, { read }).then((r) => r.data),
  remove: (id) => api.delete(`/messages/${id}`).then((r) => r.data),
};
export const uploadApi = {
  send: (kind, file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/uploads/${kind}`, form).then((r) => r.data);
  },
};
