import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle session expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local storage on authentication error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, expiresIn, expiresAt } = response.data;
    
    // Store token and expiration
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expiresAt);
    
    // Set up automatic token refresh
    setTimeout(() => {
      authService.refreshSession();
    }, expiresIn - 2 * 60 * 1000); // Refresh 2 minutes before expiration
    
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token, expiresIn, expiresAt } = response.data;
    
    // Store token and expiration
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expiresAt);
    
    // Set up automatic token refresh
    setTimeout(() => {
      authService.refreshSession();
    }, expiresIn - 2 * 60 * 1000);
    
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user');
    }
  },
  
  refreshSession: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token, expiresIn, expiresAt } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expiresAt);
      
      // Set up next refresh
      setTimeout(() => {
        authService.refreshSession();
      }, expiresIn - 2 * 60 * 1000);
      
      return response.data;
    } catch (error) {
      // If refresh fails, logout
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw error;
    }
  },
  
  checkSession: () => {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return false;
    
    const now = new Date().getTime();
    const expiresAt = new Date(expiration).getTime();
    
    return now < expiresAt;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured/featured');
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api; 