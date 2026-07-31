import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../../core/services/theme.service';

// VALIDACIÓN PERSONALIZADA: COINCIDENCIA DE CONTRASEÑAS
function matchPasswordsValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
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

        <div class="card-header">
          <h2>Restablecer Contraseña</h2>
          <p>Ingrese su nueva clave de acceso para actualizar su cuenta.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
          
          <!-- NUEVA CONTRASEÑA -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nueva Contraseña</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
            <mat-icon matPrefix class="input-icon">lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" type="button">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="resetForm.get('password')?.hasError('required')">Requerido</mat-error>
            <mat-error *ngIf="resetForm.get('password')?.hasError('minlength')">Mínimo 8 caracteres</mat-error>
          </mat-form-field>

          <!-- CONFIRMAR CONTRASEÑA -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Contraseña</mat-label>
            <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'" formControlName="confirmPassword">
            <mat-icon matPrefix class="input-icon">lock_reset</mat-icon>
            <button mat-icon-button matSuffix (click)="hideConfirmPassword.set(!hideConfirmPassword())" type="button">
              <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('required')">Requerido</mat-error>
            <mat-error *ngIf="resetForm.hasError('passwordMismatch') && resetForm.get('confirmPassword')?.touched">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>

          <button mat-flat-button class="btn-submit" [disabled]="resetForm.invalid || isLoading()" type="submit">
            <mat-spinner *ngIf="isLoading()" diameter="22" class="spinner-inline"></mat-spinner>
            <span *ngIf="!isLoading()">Guardar Contraseña</span>
          </button>
        </form>

        <div class="card-footer">
          <a routerLink="/login" class="back-link">
            <mat-icon class="link-icon">arrow_back</mat-icon> Cancelar y Volver
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
    .auth-form { display: flex; flex-direction: column; gap: 10px; }
    .full-width { width: 100%; }
    .input-icon { color: var(--brand-accent) !important; margin-right: 8px; }
    .btn-submit { height: 48px; font-size: 1rem; font-weight: 700; border-radius: 8px; background-color: var(--brand-primary) !important; color: white !important; margin-top: 8px; }
    .card-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); text-align: center; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--brand-accent); text-decoration: none; font-weight: 700; font-size: 0.88rem; }
    .back-link:hover { text-decoration: underline; }
    .link-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public themeService = inject(ThemeService);

  isLoading = signal<boolean>(false);
  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);
  token = signal<string | null>(null);

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchPasswordsValidator });

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token') || 'demo-token');
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
      this.snackBar.open('¡Contraseña actualizada con éxito!', 'Iniciar Sesión', { duration: 3000 });
      this.router.navigate(['/login']);
    }, 1200);
  }
}
