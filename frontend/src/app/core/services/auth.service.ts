import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { User, AuthResponse, Role } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  // TOKENS & USER STATE SIGNALS
  currentUser = signal<User | null>(this.getStoredUser());
  isAuthenticated = signal<boolean>(!!this.getAccessToken());
  
  private timeoutTimer: any;
  private readonly TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos por inactividad

  // USUARIO SUPERADMIN DEFAULT
  public readonly DEFAULT_SUPERADMIN: User = {
    id: 'usr-001',
    username: 'anamendoza',
    email: 'amendoza@farmakd.com',
    nombreCompleto: 'Ana Mendoza',
    role: 'SUPERADMIN',
    permissions: { canRead: true, canWrite: true, canDelete: true, canAudit: true }
  };

  constructor() {
    this.initActivityListener();
  }

  // LOGIN CON CREDENCIALES DE SUPERADMIN O CUALQUIER USUARIO
  login(usernameVal: string, passwordVal: string): Observable<AuthResponse> {
    const isSuperAdmin = (usernameVal === 'anamendoza' || usernameVal === 'amendoza@farmakd.com') && passwordVal === 'Lafken26';
    
    const userToLogin: User = isSuperAdmin ? this.DEFAULT_SUPERADMIN : {
      id: 'usr-regular',
      username: usernameVal,
      email: usernameVal.includes('@') ? usernameVal : `${usernameVal}@marianix.com`,
      nombreCompleto: usernameVal,
      role: 'AUDITOR_MEDICO',
      permissions: { canRead: true, canWrite: true, canDelete: false, canAudit: true }
    };

    const mockResponse: AuthResponse = {
      accessToken: 'mock-jwt-access-token-' + Date.now(),
      refreshToken: 'mock-jwt-refresh-token-' + Date.now(),
      user: userToLogin,
      expiresIn: 3600
    };

    return of(mockResponse).pipe(
      delay(800),
      tap(res => {
        this.setSession(res);
        this.resetTimeout();
      })
    );
  }

  // GUARDAR SESIÓN EN STORAGE
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
    localStorage.setItem('user_data', JSON.stringify(authResult.user));

    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  // REFRESH TOKEN
  refreshToken(): Observable<AuthResponse> {
    const rToken = localStorage.getItem('refresh_token');
    if (!rToken) return throwError(() => new Error('No refresh token available'));

    const mockRefreshed: AuthResponse = {
      accessToken: 'refreshed-jwt-access-token-' + Date.now(),
      refreshToken: rToken,
      user: this.currentUser() || this.DEFAULT_SUPERADMIN,
      expiresIn: 3600
    };

    return of(mockRefreshed).pipe(
      tap(res => this.setSession(res))
    );
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    clearTimeout(this.timeoutTimer);

    this.router.navigate(['/login']);
  }

  // CONTROL DE TIMEOUT POR INACTIVIDAD
  private resetTimeout(): void {
    clearTimeout(this.timeoutTimer);
    if (this.isAuthenticated()) {
      this.timeoutTimer = setTimeout(() => {
        alert('Su sesión ha expirado por inactividad.');
        this.logout();
      }, this.TIMEOUT_MS);
    }
  }

  private initActivityListener(): void {
    ['click', 'mousemove', 'keypress', 'scroll'].forEach(evt => {
      window.addEventListener(evt, () => this.resetTimeout());
    });
  }

  // GETTERS DE STORAGE
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredUser(): User | null {
    const u = localStorage.getItem('user_data');
    return u ? JSON.parse(u) : null;
  }

  hasRole(allowedRoles: Role[]): boolean {
    const u = this.currentUser();
    return !!u && allowedRoles.includes(u.role);
  }
}
