import { Component, inject, OnInit, ViewChild, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablasAuxiliaresService } from '../services/tablas-auxiliares.service';
import { TablaAuxiliarFormDialogComponent } from './tabla-auxiliar-form-dialog.component';
import { BaseTablaAuxiliar } from '../models/tablas-auxiliares.model';

@Component({
  selector: 'app-crud-base-tabla-auxiliar',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="crud-container notranslate" translate="no">
      
      <!-- TOOLBAR & HEADER -->
      <div class="crud-header">
        <div>
          <h1 class="page-title">Gestión de {{ entityTitle }}</h1>
          <p class="page-subtitle">Administración de tabla auxiliar del sistema Marianix</p>
        </div>
        
        <div class="actions-group">
          <button mat-stroked-button class="btn-export" (click)="exportExcel()" title="Exportar a Excel">
            <mat-icon color="primary">description</mat-icon> Excel
          </button>
          <button mat-stroked-button class="btn-export" (click)="exportPDF()" title="Exportar a PDF">
            <mat-icon color="warn">picture_as_pdf</mat-icon> PDF
          </button>
          <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
            <mat-icon>add</mat-icon> Nuevo {{ entityTitle }}
          </button>
        </div>
      </div>

      <!-- BUSCADOR & TABLA -->
      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar en {{ entityTitle }}...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Escriba código o descripción...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div *ngIf="isLoading()" class="spinner-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-scroll-wrapper" *ngIf="!isLoading()">
          <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
            
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="paisNombre" *ngIf="entityKey === 'provincias'">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>País</th>
              <td mat-cell *matCellDef="let element">{{ element.paisNombre || 'ARGENTINA' }}</td>
            </ng-container>

            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
              <td mat-cell *matCellDef="let element">{{ element.descripcion }}</td>
            </ng-container>

            <ng-container matColumnDef="fechaDesde" *ngIf="entityKey === 'periodos'">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Desde</th>
              <td mat-cell *matCellDef="let element">{{ element.fechaDesde }}</td>
            </ng-container>

            <ng-container matColumnDef="fechaHasta" *ngIf="entityKey === 'periodos'">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Hasta</th>
              <td mat-cell *matCellDef="let element">{{ element.fechaHasta }}</td>
            </ng-container>

            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
              <td mat-cell *matCellDef="let element">
                <span class="badge" [ngClass]="element.activo ? 'badge-active' : 'badge-inactive'">
                  {{ element.activo ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
              <td mat-cell *matCellDef="let element" class="text-center">
                <button mat-icon-button color="primary" (click)="openForm(element)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" [disabled]="element.esProtegido" (click)="onDelete(element)" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons class="paginator"></mat-paginator>
      </div>

    </div>
  `,
  styles: [`
    .crud-container { display: flex; flex-direction: column; gap: 16px; }
    .crud-header { display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .actions-group { display: flex; gap: 10px; align-items: center; }
    .btn-export { height: 44px; border-radius: 8px; font-weight: 700; border-color: var(--border-color); }
    .btn-new { height: 44px; border-radius: 8px; font-weight: 700; background-color: var(--brand-primary) !important; }
    
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .spinner-container { display: flex; justify-content: center; padding: 40px 0; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-center { text-align: center; }
    
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class CrudBaseComponent implements OnInit {
  @Input({ required: true }) entityKey!: string;
  @Input({ required: true }) entityTitle!: string;

  private apiService = inject(TablasAuxiliaresService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['codigo', 'descripcion', 'activo', 'acciones'];
  isLoading = signal<boolean>(true);
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    if (this.entityKey === 'provincias') {
      this.displayedColumns = ['codigo', 'paisNombre', 'descripcion', 'activo', 'acciones'];
    }
    if (this.entityKey === 'periodos') {
      this.displayedColumns = ['codigo', 'descripcion', 'fechaDesde', 'fechaHasta', 'activo', 'acciones'];
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.apiService.getAll<any>(this.entityKey).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openForm(item?: any): void {
    const dialogRef = this.dialog.open(TablaAuxiliarFormDialogComponent, {
      width: '460px',
      data: { item, entityKey: this.entityKey, entityTitle: this.entityTitle }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open(`¡${this.entityTitle} guardado exitosamente!`, 'Aceptar', { duration: 2500 });
        this.loadData();
      }
    });
  }

  onDelete(item: any): void {
    if (confirm(`¿Está seguro de eliminar '${item.descripcion}'?`)) {
      this.apiService.delete(this.entityKey, item.id).subscribe({
        next: () => {
          this.snackBar.open(`'${item.descripcion}' eliminado correctamente`, 'Aceptar', { duration: 2500 });
          this.loadData();
        },
        error: (err) => alert(err.message)
      });
    }
  }

  exportExcel(): void {
    this.snackBar.open(`Exportando ${this.entityTitle} a Excel...`, 'Cerrar', { duration: 2000 });
  }

  exportPDF(): void {
    this.snackBar.open(`Exportando ${this.entityTitle} a PDF...`, 'Cerrar', { duration: 2000 });
  }
}
