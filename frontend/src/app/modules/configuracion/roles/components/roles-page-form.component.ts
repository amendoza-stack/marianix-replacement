import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-roles-page-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="notranslate" translate="no">{{ titleText }}</h2>
    <mat-dialog-content class="modal-content notranslate" translate="no">
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; padding-top: 8px; min-width: 400px;">
        <mat-form-field appearance="outline">
          <mat-label>Código del Rol</mat-label>
          <input matInput formControlName="codigo" readonly style="font-weight: 700; color: #0284C7; background: #F0F9FF;">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre del Rol</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Auditor Senior">
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3" placeholder="Descripción detallada de responsabilidades..."></textarea>
        </mat-form-field>

        <mat-slide-toggle formControlName="activo" color="primary">Estado Activo</mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class RolesPageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RolesPageFormComponent>);
  public data: any = inject(MAT_DIALOG_DATA);

  titleText = 'Nuevo Rol';
  form: FormGroup = this.fb.group({
    codigo: [{ value: '', disabled: true }],
    nombre: ['', Validators.required],
    descripcion: [''],
    activo: [true]
  });

  ngOnInit(): void {
    if (this.data && this.data.item) {
      this.titleText = 'Editar Rol';
      this.form.patchValue(this.data.item);
      if (this.data.item.codigo) this.form.get('codigo')?.setValue(this.data.item.codigo);
    } else {
      const count = (this.data?.totalItems || 0) + 1;
      this.form.get('codigo')?.setValue('ROL-' + String(count).padStart(3, '0'));
    }
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
