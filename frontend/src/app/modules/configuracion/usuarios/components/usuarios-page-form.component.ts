import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios-page-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule, 
    MatIconModule
  ],
  template: `
    <div class="single-screen-dialog notranslate" translate="no" style="min-width: 450px; padding: 20px;">
      
      <!-- HEADER DEL DIÁLOGO -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <mat-icon style="color: #1e293b; font-size: 28px; width: 28px; height: 28px;">
            {{ data?.id ? 'edit_note' : 'person_add' }}
          </mat-icon>
          <div>
            <h2 mat-dialog-title style="margin: 0; font-weight: 700; color: #0f172a; font-size: 1.25rem;">
              {{ data?.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h2>
            <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
              Complete la información de la cuenta y sus accesos
            </p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- CUERPO FORMULARIO -->
      <mat-dialog-content>
        <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 16px; padding-top: 10px;">
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre Completo</mat-label>
            <input matInput formControlName="nombre" placeholder="Ej: Ana Mendoza">
            <mat-icon matPrefix style="margin-right: 8px; color: #64748b;">badge</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre de Usuario (Username)</mat-label>
            <input matInput formControlName="username" placeholder="amendoza">
            <mat-icon matPrefix style="margin-right: 8px; color: #64748b;">account_circle</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Correo Electrónico</mat-label>
            <input matInput formControlName="email" type="email" placeholder="ana.mendoza@marianix.com">
            <mat-icon matPrefix style="margin-right: 8px; color: #64748b;">email</mat-icon>
          </mat-form-field>

          <!-- NUEVO SELECTOR MÚLTIPLE DE ROLES -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Roles Asignados</mat-label>
            <mat-select formControlName="roles" multiple placeholder="Seleccione los roles del usuario">
              <mat-option *ngFor="let rol of rolesList" [value]="rol.nombre">
                {{ rol.nombre }}
              </mat-option>
            </mat-select>
            <mat-icon matPrefix style="margin-right: 8px; color: #64748b;">security</mat-icon>
          </mat-form-field>

          <div style="padding: 4px 0;">
            <mat-slide-toggle formControlName="activo" color="primary">
              Usuario Activo en el Sistema
            </mat-slide-toggle>
          </div>

        </form>
      </mat-dialog-content>

      <!-- BOTONES DE ACCIÓN -->
      <mat-dialog-actions align="end" style="margin-top: 20px; gap: 10px;">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" (click)="guardar()" [disabled]="form.invalid">
          <mat-icon>save</mat-icon> Guardar
        </button>
      </mat-dialog-actions>

    </div>
  `
})
export class UsuariosPageFormComponent implements OnInit {
  form: FormGroup;
  rolesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<UsuariosPageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [[]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    // 1. Cargar roles disponibles desde el Backend
    this.http.get<any[]>('http://127.0.0.1:8000/api/v1/seguridad/roles').subscribe({
      next: (roles) => this.rolesList = roles,
      error: (err) => console.error('Error cargando roles', err)
    });

    // 2. Parchear formulario si es edición
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        nombre: this.data.nombre || this.data.nombre_completo || '',
        username: this.data.username || '',
        email: this.data.email || '',
        roles: this.data.roles || [],
        activo: this.data.activo !== undefined ? this.data.activo : true
      });
    }
  }

  guardar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}