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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ObrasSocialesService } from '../services/gestion-salud.service';
import { ObraSocialDetailDialogComponent } from '../dialogs/obra-social-detail-dialog.component';
import { ObraSocialInterface } from '../models/gestion-salud.model';

@Component({
  selector: 'app-obras-sociales-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Gestión de Obras Sociales</h1>
          <p class="page-subtitle">Administración de entidades prestadoras, planes, farmacias e instructivos de monodrogas</p>
        </div>
        <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
          <mat-icon>add_location_alt</mat-icon> Nueva Obra Social
        </button>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar obra social...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Buscar por código, sigla, razón social o CUIT...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
            <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="sigla">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Sigla</th>
            <td mat-cell *matCellDef="let element"><strong>{{ element.sigla }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="razonSocial">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Razón Social</th>
            <td mat-cell *matCellDef="let element">{{ element.razonSocial }}</td>
          </ng-container>

          <ng-container matColumnDef="cuit">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>CUIT</th>
            <td mat-cell *matCellDef="let element" class="font-mono">{{ element.cuit }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
            <td mat-cell *matCellDef="let element">
              <span class="badge" [ngClass]="element.estado === 'Activa' ? 'badge-active' : 'badge-inactive'">
                {{ element.estado }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef class="text-center">Administrar</th>
            <td mat-cell *matCellDef="let element" class="text-center">
              <button mat-icon-button color="primary" (click)="openForm(element)" title="Administrar Obra Social (Planes, Farmacias, Monodrogas)">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
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
    .btn-new { height: 44px; border-radius: 8px; font-weight: 700; background-color: var(--brand-primary) !important; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
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
export class ObrasSocialesPageComponent implements OnInit {
  private service = inject(ObrasSocialesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<ObraSocialInterface>([]);
  displayedColumns: string[] = ['codigo', 'sigla', 'razonSocial', 'cuit', 'estado', 'acciones'];
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getObrasSociales().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openForm(item?: ObraSocialInterface): void {
    const dialogRef = this.dialog.open(ObraSocialDetailDialogComponent, {
      width: '850px',
      data: item
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open('¡Obra Social guardada con éxito!', 'Aceptar', { duration: 2500 });
        this.loadData();
      }
    });
  }
}
