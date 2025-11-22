// src/lib/api.ts

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = 'https://cantappbackendlaravel-production.up.railway.app';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Ocorreu um erro na requisição.';
        console.error('API Error:', errorMessage, 'Details:', errorData.errors);
        throw { message: errorMessage, errors: errorData.errors };
      }
      
      // Handle empty responses for DELETE, etc.
      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return {} as T;
      }

      const responseData = await response.json();
      
      // For all standard CRUD endpoints, data is expected inside a 'data' wrapper.
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
          return responseData.data as T;
      }
      
      // This path handles special cases like logout that return a message object directly
      return responseData as T;

    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
