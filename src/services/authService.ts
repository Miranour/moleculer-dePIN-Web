export interface User {
  id: string;
  email: string;
  role: 'admin' | 'researcher';
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Simulated API calls for Phase 1
export const authService = {
  login: async (email: string, password: string):Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === 'admin@depin.com' && password === 'admin123') {
      return {
        user: { id: '1', email, role: 'admin', name: 'Admin User' },
        token: 'mock-jwt-token-admin'
      };
    }
    
    if (email === 'user@depin.com' && password === 'user123') {
      return {
        user: { id: '2', email, role: 'researcher', name: 'Researcher User' },
        token: 'mock-jwt-token-researcher'
      };
    }

    throw new Error('Geçersiz e-posta veya şifre');
  },
  
  register: async (email: string, _password: string, name: string):Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      user: { id: '3', email, role: 'researcher', name },
      token: 'mock-jwt-token-new'
    };
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};
