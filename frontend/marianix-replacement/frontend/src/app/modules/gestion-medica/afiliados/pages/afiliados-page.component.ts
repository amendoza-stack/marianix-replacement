import { Component, inject, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
import { AfiliadosFacade } from '../services/afiliados.service';
import { AfiliadosService } from '../services/afiliados.service';
import { AfiliadoFormDialogComponent } from '../dialogs/afiliado-form-dialog.component';
import { AfiliadoInterface } from '../models/afiliado.model';

@Component({
  selector: 'app-afiliados-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Padrón de Afiliados</h1>
          <p class="page-subtitle">Gestión de afiliados, coberturas y vinculación familiar</p>
        </div>
        <div class="actions-group">
          <button mat-stroked-button class="btn-export" (click)="exportExcel()"><mat-icon color="primary">description</mat-icon> Excel</button>
          <button mat-stroked-button class="btn-export" (click)="exportPDF()"><mat-icon color="warn">picture_as_pdf</mat-icon> PDF</button>
          <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
            <mat-icon>person_add</mat-icon> Nuevo Afiliado
          </button>
        </div>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar afiliado...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Buscar por código, apellido, nombre, DNI, CUIL, N° Afiliado u Obra Social...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div *ngIf="facade.isLoading()" class="spinner-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="table-scroll-wrapper" *ngIf="!facade.isLoading()">
          <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
            
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="apellidoNombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Apellido y Nombre</th>
              <td mat-cell *matCellDef="let element">
                <strong>{{ element.apellido }}, {{ element.nombre }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="obraSocial">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Obra Social</th>
              <td mat-cell *matCellDef="let element">{{ element.obraSocialNombre }}</td>
            </ng-container>

            <ng-container matColumnDef="numeroAfiliado">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nº Afiliado</th>
              <td mat-cell *matCellDef="let element" class="font-mono">{{ element.numeroAfiliado }}</td>
            </ng-container>

            <ng-container matColumnDef="dni">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>DNI</th>
              <td mat-cell *matCellDef="let element">{{ element.dni }}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
              <td mat-cell *matCellDef="let element">
                <span class="badge" [ngClass]="element.estado === 'Activo' ? 'badge-active' : 'badge-inactive'">
                  {{ element.estado }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
              <td mat-cell *matCellDef="let element" class="text-center">
                <button mat-icon-button color="primary" (click)="openForm(element)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onDelete(element)" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
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
export class AfiliadosPageComponent implements OnInit {
  public facade = inject(AfiliadosFacade);
  private service = inject(AfiliadosService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<AfiliadoInterface>([]);
  displayedColumns: string[] = ['codigo', 'apellidoNombre', 'obraSocial', 'numeroAfiliado', 'dni', 'estado', 'acciones'];
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openForm(item?: AfiliadoInterface): void {
    const dialogRef = this.dialog.open(AfiliadoFormDialogComponent, {
      width: '680px',
      data: item
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open('¡Afiliado guardado con éxito!', 'Aceptar', { duration: 2500 });
        this.loadData();
      }
    });
  }

  onDelete(item: AfiliadoInterface): void {
    if (confirm(`¿Está seguro de eliminar al afiliado '${item.apellido}, ${item.nombre}'?`)) {
      this.service.delete(item.id).subscribe(() => {
        this.snackBar.open('Afiliado eliminado correctamente', 'Aceptar', { duration: 2500 });
        this.loadData();
      });
    }
  }

  exportExcel(): void {
    this.snackBar.open('Exportando padrón de afiliados a Excel...', 'Cerrar', { duration: 2000 });
  }

  exportPDF(): void {
    this.snackBar.open('Exportando padrón de afiliados a PDF...', 'Cerrar', { duration: 2000 });
  }
}
