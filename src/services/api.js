// API Service for PRN Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('prn_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('prn_token', token);
    } else {
      localStorage.removeItem('prn_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(error.error || error.message || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async logout() {
    this.setToken(null);
    return Promise.resolve({ success: true });
  }

  // Project endpoints
  async getProjects() {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getProject(id) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createProject(projectData) {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(projectData)
    });
    return this.handleResponse(response);
  }

  async updateProject(id, updates) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async deleteProject(id) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async duplicateProject(id) {
    const response = await fetch(`${API_URL}/projects/${id}/duplicate`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Template endpoints
  async getTemplates() {
    const response = await fetch(`${API_URL}/templates`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getTemplate(id) {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // File upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Brand kit
  async getBrandKit() {
    const response = await fetch(`${API_URL}/users/brand-kit`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateBrandKit(brandKit) {
    const response = await fetch(`${API_URL}/users/brand-kit`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(brandKit)
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();