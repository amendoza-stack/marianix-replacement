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
import { FarmaciasService } from '../services/farmacias.service';
import { FarmaciaInterface } from '../models/farmacia.model';
import { FarmaciaFormDialogComponent } from '../dialogs/farmacia-form-dialog.component';

@Component({
  selector: 'app-farmacias-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Padrón General de Farmacias</h1>
          <p class="page-subtitle">Gestión centralizada de prestadores y farmacias para convenios con Obras Sociales</p>
        </div>
        <button mat-flat-button color="primary" class="btn-new" (click)="openForm()">
          <mat-icon>add</mat-icon> Nueva Farmacia
        </button>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar farmacia en el padrón...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Código, descripción, CUIT, CUF, ciudad o responsable...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
            <td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="descripcion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción Comercial</th>
            <td mat-cell *matCellDef="let el"><strong>{{ el.descripcion }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="cuit">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>CUIT</th>
            <td mat-cell *matCellDef="let el" class="font-mono">{{ el.cuit }}</td>
          </ng-container>

          <ng-container matColumnDef="cuf">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>CUF</th>
            <td mat-cell *matCellDef="let el" class="font-mono font-bold">{{ el.cuf }}</td>
          </ng-container>

          <ng-container matColumnDef="ciudad">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Ciudad / Prov</th>
            <td mat-cell *matCellDef="let el">{{ el.ciudad }} ({{ el.provinciaNombre }})</td>
          </ng-container>

          <ng-container matColumnDef="drogueria">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Droguería</th>
            <td mat-cell *matCellDef="let el">{{ el.drogueriaNombre }}</td>
          </ng-container>

          <ng-container matColumnDef="responsable">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Responsable DT</th>
            <td mat-cell *matCellDef="let el">{{ el.responsableDT || 'N/A' }}</td>
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
    .btn-new { font-weight: 700; height: 40px; }
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
export class FarmaciasPageComponent implements OnInit {
  private service = inject(FarmaciasService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  dataSource = new MatTableDataSource<FarmaciaInterface>([]);
  cols = ['codigo', 'descripcion', 'cuit', 'cuf', 'ciudad', 'drogueria', 'responsable', 'estado', 'acciones'];
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

  openForm(item?: FarmaciaInterface) {
    this.dialog.open(FarmaciaFormDialogComponent, { width: '780px', data: item }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Farmacia guardada con éxito en el padrón', 'Aceptar', { duration: 2500 });
        this.load();
      }
    });
  }

  onDelete(item: FarmaciaInterface) {
    if (confirm(`¿Confirma dar de baja lógica a la farmacia '${item.descripcion}'?`)) {
      this.service.deleteLogico(item.id!).subscribe(() => {
        this.snack.open('Farmacia dada de baja correctamente', 'Aceptar', { duration: 2500 });
        this.load();
      });
    }
  }
}
