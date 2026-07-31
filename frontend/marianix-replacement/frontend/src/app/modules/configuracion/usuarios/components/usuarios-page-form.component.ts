import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-usuarios-page-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSlideToggleModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="notranslate" translate="no">{{ titleText }}</h2>
    <mat-dialog-content class="modal-content notranslate" translate="no">
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; padding-top: 8px; min-width: 440px;">
        
        <mat-form-field appearance="outline">
          <mat-label>Código</mat-label>
          <input matInput formControlName="codigo" readonly style="font-weight:700; color:#0284C7; background:#F0F9FF;">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre Completo</mat-label>
          <input matInput formControlName="nombreCompleto" placeholder="Ej: Ana Mendoza">
          <mat-error *ngIf="form.get('nombreCompleto')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Username (Nombre de Usuario)</mat-label>
          <input matInput formControlName="username" placeholder="anamendoza">
          <mat-error *ngIf="form.get('username')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Correo Electrónico</mat-label>
          <input matInput formControlName="email" placeholder="amendoza@farmakd.com">
          <mat-error *ngIf="form.get('email')?.hasError('required')">Requerido</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Formato inválido</mat-error>
        </mat-form-field>

        <!-- ROLES MÚLTIPLES (MAT-SELECT MULTIPLE) -->
        <mat-form-field appearance="outline">
          <mat-label>Roles Asignados (Selección Múltiple)</mat-label>
          <mat-select formControlName="roles" multiple>
            <mat-option value="SUPERADMIN">Superadministrador</mat-option>
            <mat-option value="ADMINISTRADOR">Administrador de Sistema</mat-option>
            <mat-option value="AUDITOR_MEDICO">Auditor Médico</mat-option>
            <mat-option value="OPERADOR">Operador de Carga</mat-option>
            <mat-option value="FARMACEUTICO">Farmacéutico Prescriptor</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('roles')?.hasError('required')">Debe seleccionar al menos un rol</mat-error>
        </mat-form-field>

        <mat-slide-toggle formControlName="activo" color="primary">Usuario Activo</mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar Usuario</button>
    </mat-dialog-actions>
  `
})
export class UsuariosPageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuariosPageFormComponent>);
  public data: any = inject(MAT_DIALOG_DATA);

  titleText = 'Nuevo Usuario';
  form: FormGroup = this.fb.group({
    codigo: [{ value: '', disabled: true }],
    nombreCompleto: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roles: [[] as Role[], Validators.required],
    activo: [true]
  });

  ngOnInit(): void {
    if (this.data && this.data.item) {
      this.titleText = 'Editar Usuario';
      this.form.patchValue(this.data.item);
      if (this.data.item.codigo) this.form.get('codigo')?.setValue(this.data.item.codigo);
    } else {
      const count = (this.data?.totalItems || 0) + 1;
      this.form.get('codigo')?.setValue('USR-' + String(count).padStart(3, '0'));
    }
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
