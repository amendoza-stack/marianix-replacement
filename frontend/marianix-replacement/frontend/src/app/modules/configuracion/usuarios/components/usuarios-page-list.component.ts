import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosPageFormComponent } from './usuarios-page-form.component';
import { UserResetPasswordDialogComponent } from './user-reset-password-dialog.component';
import { UsuarioItem } from './usuario.model';

@Component({
  selector: 'app-usuarios-page-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p class="subtitle">Administración de usuarios, asignación de roles múltiples y claves de acceso</p>
        </div>
        <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
          <mat-icon>person_add</mat-icon> Nuevo Usuario
        </button>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar usuario...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Buscar por código, username, email o nombre...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="filteredItems" class="full-width-table">
          
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="nombreCompleto">
            <th mat-header-cell *matHeaderCellDef>Usuario / Nombre</th>
            <td mat-cell *matCellDef="let element">
              <div class="user-cell">
                <strong>{{ element.nombreCompleto }}</strong>
                <span class="user-sub">&#64;{{ element.username }} &bull; {{ element.email }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>Roles Asignados</th>
            <td mat-cell *matCellDef="let element">
              <div class="roles-chips-grid">
                <span *ngFor="let r of element.roles" class="role-chip" [ngClass]="getRoleClass(r)">
                  {{ r }}
                </span>
              </div>
            </td>
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
              <button mat-icon-button color="accent" (click)="openChangePassword(element)" title="Cambiar Contraseña">
                <mat-icon>lock_reset</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="openForm(element)" title="Editar Usuario">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDelete(element)" title="Eliminar Usuario">
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
    .user-cell { display: flex; flex-direction: column; gap: 2px; }
    .user-sub { font-size: 0.78rem; color: var(--text-muted); }
    
    .roles-chips-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .role-chip { font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 12px; }
    .chip-superadmin { background: #FEE2E2; color: #991B1B; }
    .chip-admin { background: #E0F2FE; color: #075985; }
    .chip-auditor { background: #F3E8FF; color: #6B21A8; }
    .chip-operador { background: #FEF3C7; color: #92400E; }
    .chip-farmaceutico { background: #DCFCE7; color: #166534; }

    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class UsuariosPageListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['codigo', 'nombreCompleto', 'roles', 'activo', 'acciones'];
  
  allItems: UsuarioItem[] = [
    { id: 1, codigo: 'USR-001', nombreCompleto: 'Ana Mendoza', username: 'anamendoza', email: 'amendoza@farmakd.com', roles: ['SUPERADMIN', 'AUDITOR_MEDICO'], activo: true },
    { id: 2, codigo: 'USR-002', nombreCompleto: 'Carlos Rodríguez', username: 'crodriguez', email: 'crodriguez@marianix.com', roles: ['AUDITOR_MEDICO'], activo: true },
    { id: 3, codigo: 'USR-003', nombreCompleto: 'María Gómez', username: 'mgomez', email: 'mgomez@marianix.com', roles: ['OPERADOR', 'FARMACEUTICO'], activo: true },
    { id: 4, codigo: 'USR-004', nombreCompleto: 'Juan Pérez', username: 'jperez', email: 'jperez@marianix.com', roles: ['ADMINISTRADOR'], activo: false }
  ];

  filteredItems: UsuarioItem[] = [];
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
        item.nombreCompleto.toLowerCase().includes(term) ||
        item.username.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
      );
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'SUPERADMIN': return 'chip-superadmin';
      case 'ADMINISTRADOR': return 'chip-admin';
      case 'AUDITOR_MEDICO': return 'chip-auditor';
      case 'OPERADOR': return 'chip-operador';
      case 'FARMACEUTICO': return 'chip-farmaceutico';
      default: return 'chip-admin';
    }
  }

  openForm(item?: UsuarioItem): void {
    const dialogRef = this.dialog.open(UsuariosPageFormComponent, {
      width: '480px',
      data: { item, totalItems: this.allItems.length }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          const idx = this.allItems.findIndex(x => x.id === item.id);
          if (idx !== -1) this.allItems[idx] = { ...this.allItems[idx], ...result };
          this.snackBar.open('Usuario actualizado', 'Aceptar', { duration: 2500 });
        } else {
          const newUsr: UsuarioItem = { id: Date.now(), ...result };
          this.allItems = [newUsr, ...this.allItems];
          this.snackBar.open('Usuario creado exitosamente', 'Aceptar', { duration: 2500 });
        }
        this.applyFilter();
        this.cdr.detectChanges();
      }
    });
  }

  openChangePassword(item: UsuarioItem): void {
    this.dialog.open(UserResetPasswordDialogComponent, {
      width: '420px',
      data: item
    });
  }

  onDelete(item: UsuarioItem): void {
    if (confirm(`¿Está seguro de eliminar al usuario '${item.username}'?`)) {
      this.allItems = this.allItems.filter(x => x.id !== item.id);
      this.applyFilter();
      this.snackBar.open('Usuario eliminado', 'Aceptar', { duration: 2500 });
      this.cdr.detectChanges();
    }
  }
}
