import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ObrasSocialesService } from '../obras-sociales/services/gestion-salud.service';
import { LaboratorioInterface } from '../obras-sociales/models/gestion-salud.model';

@Component({
  selector: 'app-laboratorios-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatInputModule, MatFormFieldModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Padrón de Laboratorios</h1>
          <p class="page-subtitle">Registro centralizado de laboratorios productores de medicamentos</p>
        </div>
      </div>

      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar laboratorio...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Buscar por código, razón social o CUIT...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
            <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="razonSocial">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Razón Social</th>
            <td mat-cell *matCellDef="let element"><strong>{{ element.razonSocial }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="cuit">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>CUIT</th>
            <td mat-cell *matCellDef="let element" class="font-mono">{{ element.cuit }}</td>
          </ng-container>

          <ng-container matColumnDef="telefono">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Teléfono</th>
            <td mat-cell *matCellDef="let element">{{ element.telefono }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
            <td mat-cell *matCellDef="let element">
              <span class="badge" [ngClass]="element.estado === 'Activo' ? 'badge-active' : 'badge-inactive'">
                {{ element.estado }}
              </span>
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
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class LaboratoriosPageComponent implements OnInit {
  private service = inject(ObrasSocialesService);
  dataSource = new MatTableDataSource<LaboratorioInterface>([]);
  displayedColumns: string[] = ['codigo', 'razonSocial', 'cuit', 'telefono', 'estado'];
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.service.getLaboratorios().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }
}
