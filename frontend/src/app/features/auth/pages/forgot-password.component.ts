import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="auth-page notranslate" translate="no">
      <button mat-icon-button class="theme-toggle-btn" (click)="themeService.toggleTheme()" title="Cambiar Tema">
        <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <mat-card class="auth-card">
        <div class="brand-logo">
          <mat-icon class="logo-icon">local_pharmacy</mat-icon>
          <div class="brand-text">
            <h1>Marianix</h1>
            <span class="subtext">AUDITORÍA MÉDICA</span>
          </div>
        </div>

        <!-- VISTA 1: FORMULARIO DE SOLICITUD DE EMAIL -->
        <ng-container *ngIf="!emailSent()">
          <div class="card-header">
            <h2>Recuperar Contraseña</h2>
            <p>Ingrese su correo registrado para recibir las instrucciones de restablecimiento.</p>
          </div>

          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo Electrónico</mat-label>
              <input matInput formControlName="email" placeholder="ejemplo@marianix.com" autocomplete="email">
              <mat-icon matPrefix class="input-icon">email</mat-icon>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">El email es obligatorio</mat-error>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Formato de email inválido</mat-error>
            </mat-form-field>

            <button mat-flat-button class="btn-submit" [disabled]="forgotForm.invalid || isLoading()" type="submit">
              <mat-spinner *ngIf="isLoading()" diameter="22" class="spinner-inline"></mat-spinner>
              <span *ngIf="!isLoading()">Enviar Enlace</span>
            </button>
          </form>
        </ng-container>

        <!-- VISTA 2: PANTALLA DE CONFIRMACIÓN -->
        <ng-container *ngIf="emailSent()">
          <div class="confirmation-box">
            <div class="check-icon-wrapper">
              <mat-icon class="check-icon">mark_email_read</mat-icon>
            </div>
            <h2>¡Correo Enviado!</h2>
            <p>Hemos enviado un enlace de recuperación a <strong>{{ sentEmail() }}</strong>.</p>
            <p class="sub-hint">Si no lo encuentra, revise su carpeta de Correo No Deseado (Spam).</p>

            <button mat-stroked-button class="btn-resend" (click)="onResend()" [disabled]="isLoading()">
              Reenviar correo
            </button>
          </div>
        </ng-container>

        <div class="card-footer">
          <a routerLink="/login" class="back-link">
            <mat-icon class="link-icon">arrow_back</mat-icon> Volver al Iniciar Sesión
          </a>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: var(--bg-app); padding: 16px; box-sizing: border-box; position: relative; }
    .theme-toggle-btn { position: absolute; top: 20px; right: 20px; color: var(--text-main); }
    .auth-card { width: 100%; max-width: 420px; padding: 32px 28px 24px 28px; border-radius: 16px; background: var(--bg-card); box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid var(--border-color); box-sizing: border-box; }
    .brand-logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
    .logo-icon { font-size: 38px; width: 38px; height: 38px; color: var(--brand-accent); }
    .brand-text h1 { font-size: 2.2rem; font-weight: 800; color: var(--brand-primary); margin: 0; line-height: 1; }
    body.dark-theme .brand-text h1 { color: #38BDF8; }
    .brand-text .subtext { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1.5px; display: block; }
    .card-header h2 { font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin: 0 0 6px 0; text-align: center; }
    .card-header p { font-size: 0.88rem; color: var(--text-muted); margin: 0 0 20px 0; text-align: center; line-height: 1.4; }
    .auth-form { display: flex; flex-direction: column; gap: 12px; }
    .full-width { width: 100%; }
    .input-icon { color: var(--brand-accent) !important; margin-right: 8px; }
    .btn-submit { height: 48px; font-size: 1rem; font-weight: 700; border-radius: 8px; background-color: var(--brand-primary) !important; color: white !important; margin-top: 8px; }
    .confirmation-box { text-align: center; padding: 10px 0; }
    .check-icon-wrapper { width: 64px; height: 64px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; }
    .check-icon { font-size: 36px; width: 36px; height: 36px; color: #10B981; }
    .confirmation-box h2 { font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; }
    .confirmation-box p { font-size: 0.9rem; color: var(--text-muted); margin: 0 0 6px 0; }
    .sub-hint { font-size: 0.78rem !important; opacity: 0.8; margin-bottom: 20px !important; }
    .btn-resend { width: 100%; height: 44px; font-weight: 700; margin-top: 8px; }
    .card-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); text-align: center; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--brand-accent); text-decoration: none; font-weight: 700; font-size: 0.88rem; }
    .back-link:hover { text-decoration: underline; }
    .link-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  public themeService = inject(ThemeService);

  isLoading = signal<boolean>(false);
  emailSent = signal<boolean>(false);
  sentEmail = signal<string>('');

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    const emailVal = this.forgotForm.value.email || '';

    setTimeout(() => {
      this.isLoading.set(false);
      this.sentEmail.set(emailVal);
      this.emailSent.set(true);
      this.snackBar.open('Instrucciones enviadas con éxito.', 'Cerrar', { duration: 3000 });
    }, 1200);
  }

  onResend(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.snackBar.open('Correo reenviado exitosamente.', 'Entendido', { duration: 3000 });
    }, 1000);
  }
}
