import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="login-wrapper notranslate" translate="no">
      <mat-card class="login-card">
        <div class="brand-box">
          <h1>Marianix</h1>
          <span class="subtitle">AUDITORÍA MÉDICA</span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario / Email</mat-label>
            <input matInput formControlName="username" placeholder="admin@marianix.com">
            <mat-icon matPrefix style="color: #0284C7; margin-right: 8px;">person</mat-icon>
            <mat-error *ngIf="form.get('username')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <mat-icon matPrefix style="color: #0284C7; margin-right: 8px;">lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" class="btn-submit" [disabled]="form.invalid">
            Iniciar Sesión
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #0F172A; }
    .login-card { width: 100%; max-width: 380px; padding: 32px 24px; border-radius: 16px; background: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
    .brand-box { text-align: center; margin-bottom: 28px; }
    .brand-box h1 { font-size: 2.2rem; font-weight: 800; color: #0284C7; margin: 0; line-height: 1; }
    .brand-box .subtitle { font-size: 0.75rem; font-weight: 700; color: #64748B; letter-spacing: 1.5px; display: block; margin-top: 6px; }
    .login-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .btn-submit { height: 48px; font-size: 1rem; font-weight: 700; border-radius: 8px; margin-top: 12px; background-color: #0284C7 !important; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  hidePassword = true;
  form = this.fb.group({
    username: ['admin@marianix.com', Validators.required],
    password: ['123456', Validators.required]
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.router.navigate(['/dashboard']);
    }
  }
}
