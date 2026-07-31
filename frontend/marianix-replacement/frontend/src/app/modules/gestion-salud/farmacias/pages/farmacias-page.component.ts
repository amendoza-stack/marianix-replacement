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
import { MatTabsModule } from '@angular/material/tabs';
import { FarmaciasService } from '../services/farmacias.service';
import { FarmaciaColegioService } from '../services/farmacia-colegio.service';
import { FarmaciaInterface, FarmaciaColegioInterface } from '../models/farmacia.model';
import { FarmaciaFormDialogComponent } from '../dialogs/farmacia-form-dialog.component';
import { FarmaciaColegioFormDialogComponent } from '../dialogs/farmacia-colegio-form-dialog.component';

@Component({
  selector: 'app-farmacias-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule,
    MatSnackBarModule, MatTabsModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Gestión de Farmacias</h1>
          <p class="page-subtitle">Padrón General de Farmacias y Asociaciones con Colegios Farmacéuticos</p>
        </div>
      </div>

      <mat-tab-group animationDuration="150ms">
        
        <!-- PESTAÑA 1: PADRÓN DE FARMACIAS -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-ic">local_pharmacy</mat-icon> Padrón de Farmacias
          </ng-template>

          <div class="tab-content">
            <div class="header-actions-sub">
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
        </mat-tab>

        <!-- PESTAÑA 2: COLEGIOS FARMACÉUTICOS -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-ic">account_balance</mat-icon> Colegios Farmacéuticos
          </ng-template>

          <div class="tab-content">
            <div class="header-actions-sub">
              <button mat-flat-button color="primary" class="btn-new" (click)="openColegioForm()">
                <mat-icon>add</mat-icon> Nueva Asociación
              </button>
            </div>

            <div class="card-table">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Buscar asociación por farmacia o colegio...</mat-label>
                <input matInput [(ngModel)]="searchColegioTerm" (keyup)="applyColegioFilter()" placeholder="Farmacia, CUIT, CUF o Colegio...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <table mat-table [dataSource]="colegioDataSource" matSort class="full-width-table">
                <ng-container matColumnDef="codigo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Código Farmacia</th>
                  <td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.farmaciaCodigo }}</td>
                </ng-container>

                <ng-container matColumnDef="farmacia">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Farmacia</th>
                  <td mat-cell *matCellDef="let el"><strong>{{ el.farmaciaNombre }}</strong></td>
                </ng-container>

                <ng-container matColumnDef="cuit">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>CUIT</th>
                  <td mat-cell *matCellDef="let el" class="font-mono">{{ el.farmaciaCuit }}</td>
                </ng-container>

                <ng-container matColumnDef="cuf">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>CUF</th>
                  <td mat-cell *matCellDef="let el" class="font-mono font-bold">{{ el.farmaciaCuf }}</td>
                </ng-container>

                <ng-container matColumnDef="colegio">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Colegio Farmacéutico</th>
                  <td mat-cell *matCellDef="let el" class="text-purple font-bold">{{ el.colegioFarmaceuticoNombre }}</td>
                </ng-container>

                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                  <td mat-cell *matCellDef="let el">
                    <span class="badge" [ngClass]="el.estado === 'Activo' ? 'badge-active' : 'badge-inactive'">
                      {{ el.estado }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="fechaAlta">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Alta</th>
                  <td mat-cell *matCellDef="let el">{{ el.fechaAlta }}</td>
                </ng-container>

                <ng-container matColumnDef="usuarioAlta">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario Alta</th>
                  <td mat-cell *matCellDef="let el" class="font-mono">{{ el.usuarioAlta }}</td>
                </ng-container>

                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
                  <td mat-cell *matCellDef="let el" class="text-center">
                    <button mat-icon-button color="primary" (click)="openColegioForm(el)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button color="warn" (click)="onDeleteColegio(el)"><mat-icon>delete</mat-icon></button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="colegioCols"></tr>
                <tr mat-row *matRowDef="let row; columns: colegioCols;"></tr>
              </table>

              <mat-paginator #colegioPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .header-actions-sub { display: flex; justify-content: flex-end; margin-bottom: 12px; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .btn-new { font-weight: 700; height: 40px; }
    .tab-ic { font-size: 20px; width: 20px; height: 20px; margin-right: 6px; }
    .tab-content { padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-purple { color: #8B5CF6; }
    .text-center { text-align: center; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class FarmaciasPageComponent implements OnInit {
  private service = inject(FarmaciasService);
  private colegioService = inject(FarmaciaColegioService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  dataSource = new MatTableDataSource<FarmaciaInterface>([]);
  cols = ['codigo', 'descripcion', 'cuit', 'cuf', 'ciudad', 'drogueria', 'responsable', 'estado', 'acciones'];
  searchTerm = '';

  colegioDataSource = new MatTableDataSource<FarmaciaColegioInterface>([]);
  colegioCols = ['codigo', 'farmacia', 'cuit', 'cuf', 'colegio', 'estado', 'fechaAlta', 'usuarioAlta', 'acciones'];
  searchColegioTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('colegioPaginator') colegioPaginator!: MatPaginator;

  ngOnInit() {
    this.load();
    this.loadColegios();
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadColegios() {
    this.colegioService.getAll().subscribe(res => {
      this.colegioDataSource.data = res;
      this.colegioDataSource.paginator = this.colegioPaginator;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  applyColegioFilter() {
    this.colegioDataSource.filter = this.searchColegioTerm.trim().toLowerCase();
  }

  openForm(item?: FarmaciaInterface) {
    this.dialog.open(FarmaciaFormDialogComponent, { width: '780px', data: item }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Farmacia guardada con éxito en el padrón', 'Aceptar', { duration: 2500 });
        this.load();
      }
    });
  }

  openColegioForm(item?: FarmaciaColegioInterface) {
    this.dialog.open(FarmaciaColegioFormDialogComponent, { width: '520px', data: item }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Asociación con Colegio Farmacéutico guardada con éxito', 'Aceptar', { duration: 2500 });
        this.loadColegios();
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

  onDeleteColegio(item: FarmaciaColegioInterface) {
    if (confirm(`¿Confirma dar de baja lógica la asociación entre '${item.farmaciaNombre}' y '${item.colegioFarmaceuticoNombre}'?`)) {
      this.colegioService.deleteLogico(item.id!).subscribe(() => {
        this.snack.open('Asociación dada de baja correctamente', 'Aceptar', { duration: 2500 });
        this.loadColegios();
      });
    }
  }
}
