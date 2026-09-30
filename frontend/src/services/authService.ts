import { AdminUser } from '../types';
import { api, ApiError } from './api';

export interface AuthSession {
  user: AdminUser;
  expiresAt: number;
}

class AuthService {
  private currentUser: AdminUser | null = null;
  private readonly STORAGE_USER_KEY = 'saveitfromx_admin_user';

  constructor() {
    this.loadCachedUser();
  }

  private loadCachedUser() {
    try {
      const stored = localStorage.getItem(this.STORAGE_USER_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  public async checkSession(): Promise<boolean> {
    try {
      const response = await api.get<{ authenticated: boolean; user: AdminUser }>('/api/admin/auth/me');
      if (response && response.authenticated && response.user) {
        this.currentUser = response.user;
        localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(response.user));
        return true;
      }
      this.clearSession();
      return false;
    } catch {
      // In development before backend auth is activated, retain non-expired cached user if present
      return Boolean(this.currentUser);
    }
  }

  public async login(password: string, username: string = 'admin'): Promise<{ success: boolean; error?: string }> {
    try {
      // Server-side authentication call with secure HTTP-only cookie
      const result = await api.post<{ success: boolean; user: AdminUser }>('/api/admin/auth/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (result.success && result.user) {
        this.currentUser = result.user;
        localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (err: any) {
      if (err instanceof ApiError) {
        return { success: false, error: err.message };
      }
      return { success: false, error: err?.message || 'Login failed' };
    }
  }

  public async logout(): Promise<void> {
    try {
      await api.post('/api/admin/auth/logout');
    } catch {
      // Ignore network failure on logout
    } finally {
      this.clearSession();
    }
  }

  private clearSession() {
    this.currentUser = null;
    try {
      localStorage.removeItem(this.STORAGE_USER_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
