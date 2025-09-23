const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  expires_in: number;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
      this.clearAuth();
    }
  }

  private saveToStorage(token: string, user: User) {
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving auth to storage:', error);
    }
  }

  private clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async signUp(request: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Signup failed');
    }

    const authResponse: AuthResponse = await response.json();
    
    // Store auth data
    this.token = authResponse.access_token;
    this.user = authResponse.user;
    this.saveToStorage(authResponse.access_token, authResponse.user);

    return authResponse;
  }

  async signIn(request: SignInRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const authResponse: AuthResponse = await response.json();
    
    // Store auth data
    this.token = authResponse.access_token;
    this.user = authResponse.user;
    this.saveToStorage(authResponse.access_token, authResponse.user);

    return authResponse;
  }

  async signOut(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during signout:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.clearAuth();
        throw new Error('Session expired. Please login again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get user info');
    }

    const user: User = await response.json();
    this.user = user;
    this.saveToStorage(this.token, user);

    return user;
  }

  async refreshToken(): Promise<AuthResponse> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      this.clearAuth();
      throw new Error('Failed to refresh token');
    }

    const authResponse: AuthResponse = await response.json();
    
    // Update stored auth data
    this.token = authResponse.access_token;
    this.user = authResponse.user;
    this.saveToStorage(authResponse.access_token, authResponse.user);

    return authResponse;
  }

  // Utility methods
  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // Get headers for authenticated requests
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Wrapper for authenticated fetch requests
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      try {
        // Try to refresh token
        await this.refreshToken();
        
        // Retry the request with new token
        const retryHeaders = {
          ...this.getAuthHeaders(),
          ...(options.headers || {}),
        };
        
        return fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      } catch (error) {
        // Refresh failed, clear auth and throw
        this.clearAuth();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Export types
export type { User, AuthResponse, SignUpRequest, SignInRequest };
