import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModuloPermiso, LISTA_MODULOS_DEFAULT } from './roles.model';

@Component({
  selector: 'app-roles-page-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSlideToggleModule,
    MatButtonModule, 
    MatIconModule
  ],
  template: `
    <div class="single-screen-dialog notranslate" translate="no" style="min-width: 800px; padding: 24px;">
      
      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <mat-icon style="color: #0f172a; font-size: 32px; width: 32px; height: 32px;">admin_panel_settings</mat-icon>
          <div>
            <h2 mat-dialog-title style="margin: 0; font-weight: 700; color: #0f172a; font-size: 1.35rem;">
              {{ data?.id ? 'Editar Rol' : 'Nuevo Rol' }}
            </h2>
            <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
              Defina las características del rol y configure los permisos de acceso en una sola vista
            </p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close type="button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content style="max-height: 70vh; overflow-y: auto;">
        
        <!-- SECCIÓN 1: INFORMACIÓN PRINCIPAL -->
        <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h3 style="margin-top: 0; font-size: 0.95rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 8px;">
            <mat-icon style="font-size: 20px;">badge</mat-icon> 1. Información Principal del Rol
          </h3>
          <form [formGroup]="form" style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; margin-top: 12px;">
            <mat-form-field appearance="outline">
              <mat-label>Nombre del Rol</mat-label>
              <input matInput formControlName="nombre" placeholder="Ej: AUDITOR_FARMACIA">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Descripción / Alcance</mat-label>
              <input matInput formControlName="descripcion" placeholder="Descripción detallada de funciones">
            </mat-form-field>
          </form>
        </div>

        <!-- SECCIÓN 2: PERMISOS POR MÓDULO (23 MÓDULOS) -->
        <div style="background: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 8px;">
              <mat-icon style="font-size: 20px; color: #2563eb;">vpn_key</mat-icon> 
              2. Permisos por Módulo (23 Módulos)
            </h3>
            <div style="display: flex; gap: 10px;">
              <button mat-stroked-button (click)="marcarTodos(true)" type="button" style="color: #2563eb;">
                <mat-icon>done_all</mat-icon> Marcar Todos
              </button>
              <button mat-stroked-button (click)="marcarTodos(false)" type="button" style="color: #ef4444;">
                <mat-icon>remove_done</mat-icon> Desmarcar Todos
              </button>
            </div>
          </div>

          <!-- TABLA DE PERMISOS GRANULARES -->
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; font-size: 0.75rem; text-transform: uppercase;">
                <th style="padding: 10px 12px;">Módulo del Sistema</th>
                <th style="padding: 10px; text-align: center;">Lectura</th>
                <th style="padding: 10px; text-align: center;">Escritura</th>
                <th style="padding: 10px; text-align: center;">Eliminación</th>
                <th style="padding: 10px; text-align: center;">Auditoría</th>
                <th style="padding: 10px; text-align: center;">Acción Rápida</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of permisos" style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px;">
                  <span style="font-size: 0.65rem; font-weight: 800; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; margin-right: 6px;">
                    {{ m.categoria }}
                  </span>
                  <strong style="color: #0f172a;">{{ m.moduloNombre }}</strong>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <mat-slide-toggle [(ngModel)]="m.lectura" color="primary"></mat-slide-toggle>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <mat-slide-toggle [(ngModel)]="m.escritura" color="primary"></mat-slide-toggle>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <mat-slide-toggle [(ngModel)]="m.eliminacion" color="warn"></mat-slide-toggle>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <mat-slide-toggle [(ngModel)]="m.auditoria" color="primary"></mat-slide-toggle>
                </td>
                <td style="padding: 10px; text-align: center;">
                  <button mat-button type="button" (click)="setFila(m, true)" style="font-size: 0.75rem; color: #2563eb; min-width: auto; padding: 0 4px;">Todos</button>
                  <button mat-button type="button" (click)="setFila(m, false)" style="font-size: 0.75rem; color: #ef4444; min-width: auto; padding: 0 4px;">Ninguno</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </mat-dialog-content>

      <!-- BOTONES DE ACCIÓN DIÁLOGO -->
      <mat-dialog-actions align="end" style="margin-top: 20px; gap: 12px;">
        <button mat-button mat-dialog-close type="button">Cancelar</button>
        <button mat-flat-button color="primary" (click)="guardar()" [disabled]="form.invalid" type="button">
          <mat-icon>save</mat-icon> Guardar Rol y Permisos
        </button>
      </mat-dialog-actions>

    </div>
  `
})
export class RolesPageFormComponent implements OnInit {
  form: FormGroup;
  permisos: ModuloPermiso[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RolesPageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    // Inicializar siempre con la matriz completa de 23 módulos
    this.permisos = JSON.parse(JSON.stringify(LISTA_MODULOS_DEFAULT));

    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        nombre: this.data.nombre || '',
        descripcion: this.data.descripcion || ''
      });

      if (this.data.permisos && Array.isArray(this.data.permisos) && this.data.permisos.length > 0) {
        const mapaExistentes = new Map(this.data.permisos.map((p: ModuloPermiso) => [p.moduloId, p]));
        this.permisos = LISTA_MODULOS_DEFAULT.map(def => {
          const ex = mapaExistentes.get(def.moduloId);
          return ex ? { ...def, ...ex } : { ...def };
        });
      }
    }
  }

  marcarTodos(val: boolean): void {
    this.permisos.forEach(m => {
      m.lectura = val;
      m.escritura = val;
      m.eliminacion = val;
      m.auditoria = val;
    });
  }

  setFila(m: ModuloPermiso, val: boolean): void {
    m.lectura = val;
    m.escritura = val;
    m.eliminacion = val;
    m.auditoria = val;
  }

  guardar(): void {
    if (this.form.valid) {
      const payload = {
        id: this.form.value.id,
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        permisos: this.permisos
      };
      this.dialogRef.close(payload);
    }
  }
}