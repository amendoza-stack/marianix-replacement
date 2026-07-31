import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="login-page notranslate" translate="no">
      <button mat-icon-button class="theme-toggle-btn" (click)="themeService.toggleTheme()" title="Cambiar Tema">
        <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <mat-card class="login-card">
        <div class="login-header">
          <div class="brand-logo">
            <mat-icon class="logo-icon">local_pharmacy</mat-icon>
            <div class="brand-text">
              <h1>Marianix</h1>
              <span class="subtext">AUDITORÍA MÉDICA</span>
            </div>
          </div>
          <p class="welcome-text">Ingrese sus credenciales de acceso</p>
        </div>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario o Email</mat-label>
              <input matInput formControlName="username" placeholder="anamendoza">
              <mat-icon matPrefix class="input-icon">person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix class="input-icon">lock</mat-icon>
              <button mat-icon-button matSuffix (click)="togglePasswordVisibility()" type="button" tabindex="-1">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe" color="primary">Recordarme</mat-checkbox>
              <a routerLink="/forgot-password" class="forgot-link">¿Olvidó su contraseña?</a>
            </div>

            <button mat-flat-button class="btn-submit" [disabled]="loginForm.invalid || isLoading()" type="submit">
              <mat-spinner *ngIf="isLoading()" diameter="22" class="spinner-inline"></mat-spinner>
              <span *ngIf="!isLoading()">Ingresar</span>
            </button>
          </form>
        </mat-card-content>

        <div class="login-footer">
          <span>&copy; 2026 Marianix Sistema de Auditoría Médica</span>
          <span class="version">v2.4.0 - Enterprise Edition</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: var(--bg-app); padding: 16px; box-sizing: border-box; position: relative; }
    .theme-toggle-btn { position: absolute; top: 20px; right: 20px; color: var(--text-main); }
    .login-card { width: 100%; max-width: 420px; padding: 36px 28px 20px 28px; border-radius: 16px; background: var(--bg-card); box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid var(--border-color); box-sizing: border-box; }
    .login-header { text-align: center; margin-bottom: 24px; }
    .brand-logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
    .logo-icon { font-size: 38px; width: 38px; height: 38px; color: var(--brand-accent); }
    .brand-text h1 { font-size: 2.2rem; font-weight: 800; color: var(--brand-primary); margin: 0; line-height: 1; text-align: left; }
    body.dark-theme .brand-text h1 { color: #38BDF8; }
    .brand-text .subtext { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; display: block; }
    .welcome-text { font-size: 0.88rem; color: var(--text-muted); margin: 8px 0 0 0; }
    .login-form { display: flex; flex-direction: column; gap: 10px; }
    .full-width { width: 100%; }
    .input-icon { color: var(--brand-accent) !important; margin-right: 8px; }
    .form-options { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 8px; }
    .forgot-link { color: var(--brand-accent); text-decoration: none; font-weight: 600; cursor: pointer; }
    .forgot-link:hover { text-decoration: underline; }
    .btn-submit { height: 48px; font-size: 1rem; font-weight: 700; border-radius: 8px; background-color: var(--brand-primary) !important; color: white !important; margin-top: 8px; }
    .login-footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--text-muted); }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);

  hidePassword = signal<boolean>(true);
  isLoading = signal<boolean>(false);

  // CREDENCIALES DE SUPERADMIN PRECARGADAS
  loginForm = this.fb.group({
    username: ['anamendoza', [Validators.required]],
    password: ['Lafken26', [Validators.required]],
    rememberMe: [true]
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.snackBar.open(`¡Bienvenida ${res.user.nombreCompleto} (${res.user.role})!`, 'Aceptar', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
