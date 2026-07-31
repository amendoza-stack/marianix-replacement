import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioItem } from './usuario.model';

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const p1 = control.get('newPassword')?.value;
  const p2 = control.get('confirmPassword')?.value;
  return p1 && p2 && p1 !== p2 ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-user-reset-password-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="warn">lock_reset</mat-icon>
        Cambiar Contraseña - {{ userData.username }}
      </h2>

      <mat-dialog-content class="modal-content">
        <p class="dialog-sub">Establezca una nueva clave de acceso para <strong>{{ userData.nombreCompleto }}</strong>.</p>
        
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; padding-top: 8px; min-width: 360px;">
          <mat-form-field appearance="outline">
            <mat-label>Nueva Contraseña</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="newPassword">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('newPassword')?.hasError('required')">Requerido</mat-error>
            <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')">Mínimo 8 caracteres</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirmar Nueva Contraseña</mat-label>
            <input matInput type="password" formControlName="confirmPassword">
            <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">Requerido</mat-error>
            <mat-error *ngIf="form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="warn" [disabled]="form.invalid" (click)="onSave()">Actualizar Clave</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; margin: 0; color: var(--text-main); }
    .dialog-sub { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px; }
    .modal-content { padding-top: 8px; }
  `]
})
export class UserResetPasswordDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserResetPasswordDialogComponent>);
  private snackBar = inject(MatSnackBar);
  public userData: UsuarioItem = inject(MAT_DIALOG_DATA);

  hidePassword = true;
  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchPasswords });

  onSave(): void {
    if (this.form.valid) {
      this.snackBar.open(`¡Contraseña de ${this.userData.username} actualizada con éxito!`, 'Aceptar', { duration: 3000 });
      this.dialogRef.close(true);
    }
  }
}
