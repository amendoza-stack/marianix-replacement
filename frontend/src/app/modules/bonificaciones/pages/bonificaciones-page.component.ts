import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BonificacionesService } from '../services/bonificaciones.service';
import { BonificacionInterface } from '../models/bonificacion.model';
import { BonificacionFormDialogComponent } from '../dialogs/bonificacion-form-dialog.component';

@Component({
  selector: 'app-bonificaciones-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Gestión de Bonificaciones</h1>
          <p class="page-subtitle">Parametrización de valores de bonificación para consulta automática en Recetas</p>
        </div>
        <div class="btn-group">
          <button mat-stroked-button color="primary" class="btn-action" (click)="onExportar()">
            <mat-icon>download</mat-icon> Exportar Excel / CSV
          </button>
          <button mat-flat-button color="primary" class="btn-action" (click)="openForm()">
            <mat-icon>add</mat-icon> Nueva Bonificación
          </button>
        </div>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por código, descripción, categoría, Obra Social, plan o farmacia...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Escriba para filtrar...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
            <td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="descripcion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
            <td mat-cell *matCellDef="let el"><strong>{{ el.descripcion }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="categoria">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
            <td mat-cell *matCellDef="let el">{{ el.categoriaNombre }}</td>
          </ng-container>

          <ng-container matColumnDef="obraSocial">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Obra Social / Plan</th>
            <td mat-cell *matCellDef="let el">
              <div><strong>{{ el.obraSocialNombre }}</strong></div>
              <small class="text-muted">{{ el.planNombre }}</small>
            </td>
          </ng-container>

          <ng-container matColumnDef="ubicacion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Ubicación</th>
            <td mat-cell *matCellDef="let el">{{ el.ubicacionNombre }}</td>
          </ng-container>

          <ng-container matColumnDef="farmacia">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Farmacia</th>
            <td mat-cell *matCellDef="let el">{{ el.farmaciaNombre }} ({{ el.farmaciaCodigo }})</td>
          </ng-container>

          <ng-container matColumnDef="valor1">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Valor 1</th>
            <td mat-cell *matCellDef="let el" class="font-mono text-green font-bold">{{ el.valor1 | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="valor2">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Valor 2</th>
            <td mat-cell *matCellDef="let el" class="font-mono text-green font-bold">{{ el.valor2 | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
            <td mat-cell *matCellDef="let el">
              <span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">
                {{ el.activo ? 'ACTIVO' : 'INACTIVO' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
            <td mat-cell *matCellDef="let el" class="text-center">
              <button mat-icon-button color="primary" (click)="openForm(el)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="onDelete(el)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .btn-group { display: flex; gap: 10px; }
    .btn-action { font-weight: 700; height: 40px; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-green { color: #16A34A; }
    .text-muted { color: var(--text-muted); font-size: 0.8rem; }
    .text-center { text-align: center; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class BonificacionesPageComponent implements OnInit {
  private service = inject(BonificacionesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  dataSource = new MatTableDataSource<BonificacionInterface>([]);
  cols = ['codigo', 'descripcion', 'categoria', 'obraSocial', 'ubicacion', 'farmacia', 'valor1', 'valor2', 'estado', 'acciones'];
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openForm(item?: BonificacionInterface) {
    this.dialog.open(BonificacionFormDialogComponent, { width: '780px', data: item }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Bonificación guardada con éxito', 'Aceptar', { duration: 2500 });
        this.load();
      }
    });
  }

  onDelete(item: BonificacionInterface) {
    if (confirm(`¿Confirma dar de baja lógica a la bonificación '${item.descripcion}'?`)) {
      this.service.deleteLogico(item.id!).subscribe(() => {
        this.snack.open('Bonificación dada de baja correctamente', 'Aceptar', { duration: 2500 });
        this.load();
      });
    }
  }

  onExportar() {
    this.service.exportarExcel(this.dataSource.data);
    this.snack.open('Archivo de bonificaciones exportado con éxito', 'Aceptar', { duration: 2500 });
  }
}
