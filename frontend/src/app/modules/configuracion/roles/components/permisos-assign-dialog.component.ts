import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuloPermiso, RolItem } from './roles.model';

@Component({
  selector: 'app-permisos-assign-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="title-icon">vpn_key</mat-icon>
        Asignación de Permisos - {{ rolData.nombre }}
      </h2>

      <mat-dialog-content class="modal-content">
        <p class="dialog-sub">Configure los accesos granulares por módulo para este rol de usuario.</p>

        <div class="permisos-table-wrapper">
          <table class="permisos-table">
            <thead>
              <tr>
                <th>Módulo del Sistema</th>
                <th class="text-center">Lectura</th>
                <th class="text-center">Escritura</th>
                <th class="text-center">Eliminación</th>
                <th class="text-center">Auditoría</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of permisos">
                <td>
                  <strong class="modulo-name">{{ m.moduloNombre }}</strong>
                </td>
                <td class="text-center">
                  <mat-slide-toggle [(ngModel)]="m.lectura" color="primary"></mat-slide-toggle>
                </td>
                <td class="text-center">
                  <mat-slide-toggle [(ngModel)]="m.escritura" color="primary"></mat-slide-toggle>
                </td>
                <td class="text-center">
                  <mat-slide-toggle [(ngModel)]="m.eliminacion" color="warn"></mat-slide-toggle>
                </td>
                <td class="text-center">
                  <mat-slide-toggle [(ngModel)]="m.auditoria" color="primary"></mat-slide-toggle>
                </td>
                <td class="text-center">
                  <button mat-button color="primary" class="btn-sm" (click)="toggleAllModule(m, true)">Todos</button>
                  <button mat-button color="warn" class="btn-sm" (click)="toggleAllModule(m, false)">Ninguno</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" (click)="onSave()">
          <mat-icon>save</mat-icon> Guardar Permisos
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text-main); margin: 0; }
    .title-icon { color: var(--brand-accent); }
    .dialog-sub { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px; }
    .modal-content { max-height: 75vh; padding-top: 8px; }
    .permisos-table-wrapper { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
    .permisos-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .permisos-table th { background: var(--bg-card); padding: 12px; text-align: left; border-bottom: 2px solid var(--border-color); color: var(--text-main); font-weight: 700; }
    .permisos-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .text-center { text-align: center; }
    .modulo-name { color: var(--brand-primary); font-size: 0.9rem; }
    .btn-sm { font-size: 0.75rem; min-width: 60px; padding: 0 6px; line-height: 28px; }
  `]
})
export class PermisosAssignDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<PermisosAssignDialogComponent>);
  private snackBar = inject(MatSnackBar);
  public rolData: RolItem = inject(MAT_DIALOG_DATA);

  permisos: ModuloPermiso[] = [];

  ngOnInit(): void {
    if (this.rolData && this.rolData.permisos && this.rolData.permisos.length > 0) {
      this.permisos = JSON.parse(JSON.stringify(this.rolData.permisos));
    } else {
      this.permisos = [
        { moduloId: 'dash', moduloNombre: 'Dashboard / Estadísticas', lectura: true, escritura: true, eliminacion: false, auditoria: true },
        { moduloId: 'usr', moduloNombre: 'Gestión de Usuarios', lectura: true, escritura: true, eliminacion: true, auditoria: true },
        { moduloId: 'rol', moduloNombre: 'Roles y Permisos', lectura: true, escritura: true, eliminacion: true, auditoria: true },
        { moduloId: 'os', moduloNombre: 'Obras Sociales y Convenios', lectura: true, escritura: true, eliminacion: false, auditoria: true },
        { moduloId: 'afi', moduloNombre: 'Padrón de Afiliados', lectura: true, escritura: true, eliminacion: false, auditoria: true },
        { moduloId: 'rec', moduloNombre: 'Auditoría de Recetas', lectura: true, escritura: true, eliminacion: true, auditoria: true }
      ];
    }
  }

  toggleAllModule(mod: ModuloPermiso, value: boolean): void {
    mod.lectura = value;
    mod.escritura = value;
    mod.eliminacion = value;
    mod.auditoria = value;
  }

  onSave(): void {
    this.snackBar.open(`¡Permisos para el rol '${this.rolData.nombre}' guardados!`, 'Aceptar', { duration: 3000 });
    this.dialogRef.close(this.permisos);
  }
}
