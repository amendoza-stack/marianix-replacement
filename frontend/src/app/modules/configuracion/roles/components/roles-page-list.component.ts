import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesPageFormComponent } from './roles-page-form.component';
import { PermisosAssignDialogComponent } from './permisos-assign-dialog.component';
import { RolItem } from './roles.model';

@Component({
  selector: 'app-roles-page-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1>Gestión de Roles y Permisos</h1>
          <p class="subtitle">Administración de niveles de acceso y perfiles de seguridad</p>
        </div>
        <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
          <mat-icon>add</mat-icon> Nuevo Rol
        </button>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar rol...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Buscar por código, nombre o descripción...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="filteredItems" class="full-width-table">
          
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre del Rol</th>
            <td mat-cell *matCellDef="let element">
              <div class="role-name-box">
                <strong>{{ element.nombre }}</strong>
                <span *ngIf="element.esSistema" class="system-tag">SISTEMA</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="descripcion">
            <th mat-header-cell *matHeaderCellDef>Descripción</th>
            <td mat-cell *matCellDef="let element">{{ element.descripcion }}</td>
          </ng-container>

          <ng-container matColumnDef="activo">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let element">
              <span class="badge" [ngClass]="element.activo ? 'badge-active' : 'badge-inactive'">
                {{ element.activo ? 'ACTIVO' : 'INACTIVO' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="accent" (click)="openPermisos(element)" title="Asignar Permisos">
                <mat-icon>vpn_key</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="openForm(element)" title="Editar Rol">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" [disabled]="element.esSistema" (click)="onDelete(element)" title="Eliminar Rol">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .header-actions h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .btn-new { height: 44px; border-radius: 8px; font-weight: 700; background-color: var(--brand-primary) !important; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .role-name-box { display: flex; align-items: center; gap: 8px; }
    .system-tag { background: #E0F2FE; color: #0369A1; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class RolesPageListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'activo', 'acciones'];
  
  allItems: RolItem[] = [
    { id: 1, codigo: 'ROL-001', nombre: 'SUPERADMIN', descripcion: 'Control total del sistema y auditoría de seguridad', esSistema: true, activo: true, permisos: [] },
    { id: 2, codigo: 'ROL-002', nombre: 'ADMINISTRADOR', descripcion: 'Gestión operativa, ABMs y configuración general', esSistema: true, activo: true, permisos: [] },
    { id: 3, codigo: 'ROL-003', nombre: 'AUDITOR_MEDICO', descripcion: 'Auditoría clínica de recetas y validación de vademécum', esSistema: false, activo: true, permisos: [] },
    { id: 4, codigo: 'ROL-004', nombre: 'OPERADOR', descripcion: 'Carga transaccional e importación de archivos TXT', esSistema: false, activo: true, permisos: [] }
  ];

  filteredItems: RolItem[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.filteredItems = [...this.allItems];
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems = [...this.allItems];
    } else {
      this.filteredItems = this.allItems.filter(item => 
        item.codigo.toLowerCase().includes(term) ||
        item.nombre.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term)
      );
    }
  }

  openForm(item?: RolItem): void {
    const dialogRef = this.dialog.open(RolesPageFormComponent, {
      width: '440px',
      data: { item, totalItems: this.allItems.length }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          const idx = this.allItems.findIndex(x => x.id === item.id);
          if (idx !== -1) this.allItems[idx] = { ...this.allItems[idx], ...result };
          this.snackBar.open('Rol actualizado', 'Aceptar', { duration: 2500 });
        } else {
          const newRol: RolItem = { id: Date.now(), esSistema: false, permisos: [], ...result };
          this.allItems = [newRol, ...this.allItems];
          this.snackBar.open('Rol creado con éxito', 'Aceptar', { duration: 2500 });
        }
        this.applyFilter();
        this.cdr.detectChanges();
      }
    });
  }

  openPermisos(item: RolItem): void {
    const dialogRef = this.dialog.open(PermisosAssignDialogComponent, {
      width: '800px',
      data: item
    });

    dialogRef.afterClosed().subscribe(updatedPermisos => {
      if (updatedPermisos) {
        item.permisos = updatedPermisos;
      }
    });
  }

  onDelete(item: RolItem): void {
    if (confirm(`¿Está seguro de eliminar el rol '${item.nombre}'?`)) {
      this.allItems = this.allItems.filter(x => x.id !== item.id);
      this.applyFilter();
      this.snackBar.open('Rol eliminado', 'Aceptar', { duration: 2500 });
      this.cdr.detectChanges();
    }
  }
}
