import { apiRequest } from './queryClient';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthManager {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setAuth(authData: AuthResponse) {
    this.token = authData.token;
    this.user = authData.user;
    localStorage.setItem('auth_token', authData.token);
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const authData = await response.json();
    this.setAuth(authData);
    return authData;
  }

  async register(name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/register', { 
      name, 
      email, 
      password, 
      confirmPassword 
    });
    const authData = await response.json();
    this.setAuth(authData);
    return authData;
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No token available');
    }

    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      this.clearAuth();
      throw new Error('Token invalid');
    }

    const user = await response.json();
    this.user = user;
    return user;
  }

  logout() {
    this.clearAuth();
  }
}

export const authManager = new AuthManager();
