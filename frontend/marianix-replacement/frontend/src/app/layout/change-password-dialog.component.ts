import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const newP = control.get('newPassword')?.value;
  const confP = control.get('confirmPassword')?.value;
  return newP && confP && newP !== confP ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="notranslate" translate="no">Cambiar Contraseña</h2>
    <mat-dialog-content class="notranslate" translate="no">
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; padding-top: 8px; min-width: 360px;">
        <mat-form-field appearance="outline">
          <mat-label>Contraseña Actual</mat-label>
          <input matInput type="password" formControlName="currentPassword">
          <mat-error *ngIf="form.get('currentPassword')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nueva Contraseña</mat-label>
          <input matInput type="password" formControlName="newPassword">
          <mat-error *ngIf="form.get('newPassword')?.hasError('required')">Requerido</mat-error>
          <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')">Mínimo 8 caracteres</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Confirmar Nueva Contraseña</mat-label>
          <input matInput type="password" formControlName="confirmPassword">
          <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">Requerido</mat-error>
          <mat-error *ngIf="form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched">Las contraseñas no coinciden</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Actualizar</button>
    </mat-dialog-actions>
  `
})
export class ChangePasswordDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: matchPasswords });

  onSave(): void {
    if (this.form.valid) {
      this.snackBar.open('¡Contraseña actualizada con éxito!', 'Aceptar', { duration: 3000 });
      this.dialogRef.close(true);
    }
  }
}
