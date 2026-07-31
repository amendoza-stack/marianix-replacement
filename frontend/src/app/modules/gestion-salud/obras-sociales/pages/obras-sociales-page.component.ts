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
import { MatCardModule } from '@angular/material/card';
import { ObrasSocialesService } from '../services/obras-sociales.service';
import { 
  ObraSocialInterface, 
  PlanCoberturaInterface, 
  FarmaciaOsInterface, 
  PlanMonodrogaInterface 
} from '../models/obra-social.model';
import { PlanFormDialogComponent } from '../dialogs/plan-form-dialog.component';
import { FarmaciaOsFormDialogComponent } from '../dialogs/farmacia-os-form-dialog.component';
import { PlanMonodrogaFormDialogComponent } from '../dialogs/plan-monodroga-form-dialog.component';

@Component({
  selector: 'app-obras-sociales-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule,
    MatSnackBarModule, MatTabsModule, MatCardModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Gestión de Obras Sociales</h1>
          <p class="page-subtitle">Administración de Obras Sociales, Planes de Cobertura, Farmacias OS y Reglas de Monodrogas</p>
        </div>
      </div>

      <div class="main-layout-grid">
        <!-- MAESTRO: LISTADO DE OBRAS SOCIALES -->
        <mat-card class="master-card">
          <mat-card-header class="card-hdr">
            <mat-card-title class="hdr-title"><mat-icon color="primary">local_hospital</mat-icon> Obras Sociales</mat-card-title>
          </mat-card-header>
          <mat-card-content class="card-cnt">
            <mat-form-field appearance="outline" class="full-width search-sm">
              <mat-label>Filtrar Obra Social...</mat-label>
              <input matInput [(ngModel)]="searchOS" (keyup)="applyOsFilter()" placeholder="Nombre o CUIT...">
            </mat-form-field>

            <div class="os-list">
              <div *ngFor="let os of osDataSource.filteredData" 
                   class="os-item" 
                   [class.selected]="selectedOS?.id === os.id" 
                   (click)="selectObraSocial(os)">
                <div class="os-item-header">
                  <span class="os-code">{{ os.codigo }}</span>
                  <span class="badge badge-active" *ngIf="os.activo">ACTIVA</span>
                </div>
                <div class="os-name">{{ os.descripcion }}</div>
                <div class="os-cuit">CUIT: {{ os.cuit }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- DETALLE: PESTAÑAS Y SUBMÓDULOS HIJOS -->
        <mat-card class="detail-card" *ngIf="selectedOS">
          <mat-card-header class="card-hdr hdr-selected">
            <div>
              <span class="selected-tag">Obra Social Seleccionada:</span>
              <h2 class="selected-title">{{ selectedOS.descripcion }} ({{ selectedOS.codigo }})</h2>
            </div>
          </mat-card-header>

          <mat-card-content class="card-cnt">
            <mat-tab-group animationDuration="150ms">
              
              <!-- PESTAÑA 1: PLANES COBERTURA -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">assignment</mat-icon> Planes Cobertura ({{ planesList.length }})
                </ng-template>

                <div class="tab-content">
                  <div class="sub-hdr">
                    <mat-form-field appearance="outline" class="search-sm">
                      <mat-label>Buscar Plan...</mat-label>
                      <input matInput [(ngModel)]="searchPlan" (keyup)="applyPlanFilter()">
                    </mat-form-field>
                    <button mat-flat-button color="primary" (click)="openPlanForm()"><mat-icon>add</mat-icon> Nuevo Plan</button>
                  </div>

                  <table mat-table [dataSource]="planesDataSource" matSort class="full-width-table">
                    <ng-container matColumnDef="codigo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.codigo }}</td></ng-container>
                    <ng-container matColumnDef="descripcion"><th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th><td mat-cell *matCellDef="let el"><strong>{{ el.descripcion }}</strong></td></ng-container>
                    <ng-container matColumnDef="cobertura"><th mat-header-cell *matHeaderCellDef mat-sort-header>Cobertura (%)</th><td mat-cell *matCellDef="let el" class="font-mono text-green font-bold">{{ el.porcentajeCobertura }}%</td></ng-container>
                    <ng-container matColumnDef="copago"><th mat-header-cell *matHeaderCellDef mat-sort-header>Copago ($)</th><td mat-cell *matCellDef="let el" class="font-mono">{{ el.copagoFijo | number:'1.2-2' }}</td></ng-container>
                    <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">{{ el.activo ? 'ACTIVO' : 'INACTIVO' }}</span></td></ng-container>
                    <ng-container matColumnDef="acciones">
                      <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
                      <td mat-cell *matCellDef="let el" class="text-center">
                        <button mat-icon-button color="primary" (click)="openPlanForm(el)"><mat-icon>edit</mat-icon></button>
                        <button mat-icon-button color="warn" (click)="onDeletePlan(el)"><mat-icon>delete</mat-icon></button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="planCols"></tr>
                    <tr mat-row *matRowDef="let row; columns: planCols;"></tr>
                  </table>
                  <mat-paginator #planPaginator [pageSizeOptions]="[5, 10]" showFirstLastButtons></mat-paginator>
                </div>
              </mat-tab>

              <!-- PESTAÑA 2: FARMACIAS OS -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">local_pharmacy</mat-icon> Farmacias OS ({{ farmaciasOsList.length }})
                </ng-template>

                <div class="tab-content">
                  <div class="sub-hdr">
                    <mat-form-field appearance="outline" class="search-sm">
                      <mat-label>Buscar Farmacia OS...</mat-label>
                      <input matInput [(ngModel)]="searchFarm" (keyup)="applyFarmFilter()">
                    </mat-form-field>
                    <button mat-flat-button color="primary" (click)="openFarmaciaOsForm()"><mat-icon>add</mat-icon> Asociar Farmacia</button>
                  </div>

                  <table mat-table [dataSource]="farmaciasOsDataSource" matSort class="full-width-table">
                    <ng-container matColumnDef="codos"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código OS (CODFAROS)</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.codigoFarmaciaOs }}</td></ng-container>
                    <ng-container matColumnDef="codint"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código Interno</th><td mat-cell *matCellDef="let el" class="font-mono">{{ el.farmaciaCodigoInterno }}</td></ng-container>
                    <ng-container matColumnDef="razonSocial"><th mat-header-cell *matHeaderCellDef mat-sort-header>Razón Social (Padrón)</th><td mat-cell *matCellDef="let el"><strong>{{ el.farmaciaRazonSocial }}</strong></td></ng-container>
                    <ng-container matColumnDef="cuit"><th mat-header-cell *matHeaderCellDef mat-sort-header>CUIT</th><td mat-cell *matCellDef="let el" class="font-mono">{{ el.farmaciaCuit }}</td></ng-container>
                    <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">{{ el.activo ? 'ACTIVO' : 'INACTIVO' }}</span></td></ng-container>
                    <ng-container matColumnDef="acciones">
                      <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
                      <td mat-cell *matCellDef="let el" class="text-center">
                        <button mat-icon-button color="primary" (click)="openFarmaciaOsForm(el)"><mat-icon>edit</mat-icon></button>
                        <button mat-icon-button color="warn" (click)="onDeleteFarmaciaOs(el)"><mat-icon>delete</mat-icon></button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="farmCols"></tr>
                    <tr mat-row *matRowDef="let row; columns: farmCols;"></tr>
                  </table>
                  <mat-paginator #farmPaginator [pageSizeOptions]="[5, 10]" showFirstLastButtons></mat-paginator>
                </div>
              </mat-tab>

              <!-- PESTAÑA 3: PLAN / MONODROGA -->
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">science</mat-icon> Plan / Monodroga ({{ planMonodrogasList.length }})
                </ng-template>

                <div class="tab-content">
                  <div class="sub-hdr">
                    <mat-form-field appearance="outline" class="search-sm">
                      <mat-label>Buscar Regla Plan/Monodroga...</mat-label>
                      <input matInput [(ngModel)]="searchPm" (keyup)="applyPmFilter()">
                    </mat-form-field>
                    <button mat-flat-button color="primary" (click)="openPlanMonodrogaForm()"><mat-icon>add</mat-icon> Nueva Asociación</button>
                  </div>

                  <table mat-table [dataSource]="planMonodrogasDataSource" matSort class="full-width-table">
                    <ng-container matColumnDef="plan"><th mat-header-cell *matHeaderCellDef mat-sort-header>Plan Cobertura</th><td mat-cell *matCellDef="let el"><strong>{{ el.planDescripcion }}</strong></td></ng-container>
                    <ng-container matColumnDef="monodroga"><th mat-header-cell *matHeaderCellDef mat-sort-header>Monodroga</th><td mat-cell *matCellDef="let el" class="text-purple font-bold">{{ el.monodrogaNombre }}</td></ng-container>
                    <ng-container matColumnDef="laboratorio"><th mat-header-cell *matHeaderCellDef mat-sort-header>Laboratorio</th><td mat-cell *matCellDef="let el">{{ el.laboratorioNombre }}</td></ng-container>
                    <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">{{ el.activo ? 'ACTIVO' : 'INACTIVO' }}</span></td></ng-container>
                    <ng-container matColumnDef="acciones">
                      <th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th>
                      <td mat-cell *matCellDef="let el" class="text-center">
                        <button mat-icon-button color="primary" (click)="openPlanMonodrogaForm(el)"><mat-icon>edit</mat-icon></button>
                        <button mat-icon-button color="warn" (click)="onDeletePlanMonodroga(el)"><mat-icon>delete</mat-icon></button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="pmCols"></tr>
                    <tr mat-row *matRowDef="let row; columns: pmCols;"></tr>
                  </table>
                  <mat-paginator #pmPaginator [pageSizeOptions]="[5, 10]" showFirstLastButtons></mat-paginator>
                </div>
              </mat-tab>

            </mat-tab-group>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .main-layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; }
    .master-card, .detail-card { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); }
    .card-hdr { padding: 12px 16px; border-bottom: 1px solid var(--border-color); }
    .hdr-title { font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0; }
    .hdr-selected { background: #F0F9FF; }
    .selected-tag { font-size: 0.72rem; font-weight: 800; color: #0284C7; text-transform: uppercase; }
    .selected-title { font-size: 1.1rem; font-weight: 800; color: #0369A1; margin: 0; }
    .card-cnt { padding: 12px 16px !important; }
    .full-width { width: 100%; }
    .search-sm { margin-bottom: 8px; }
    .os-list { display: flex; flex-direction: column; gap: 8px; max-height: 65vh; overflow-y: auto; }
    .os-item { padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; }
    .os-item:hover { background: #F8FAFC; border-color: #CBD5E1; }
    .os-item.selected { background: #E0F2FE; border-color: #0284C7; }
    .os-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .os-code { font-family: monospace; font-weight: 800; color: #0284C7; font-size: 0.8rem; }
    .os-name { font-weight: 700; font-size: 0.88rem; color: var(--text-main); line-height: 1.2; }
    .os-cuit { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }
    .tab-ic { font-size: 18px; width: 18px; height: 18px; margin-right: 6px; }
    .tab-content { padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
    .sub-hdr { display: flex; justify-content: space-between; align-items: center; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-purple { color: #8B5CF6; }
    .text-green { color: #16A34A; }
    .text-center { text-align: center; }
    .badge { padding: 3px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class ObrasSocialesPageComponent implements OnInit {
  private service = inject(ObrasSocialesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  osDataSource = new MatTableDataSource<ObraSocialInterface>([]);
  selectedOS: ObraSocialInterface | null = null;
  searchOS = '';

  // PLANES
  planesList: PlanCoberturaInterface[] = [];
  planesDataSource = new MatTableDataSource<PlanCoberturaInterface>([]);
  planCols = ['codigo', 'descripcion', 'cobertura', 'copago', 'estado', 'acciones'];
  searchPlan = '';

  // FARMACIAS OS
  farmaciasOsList: FarmaciaOsInterface[] = [];
  farmaciasOsDataSource = new MatTableDataSource<FarmaciaOsInterface>([]);
  farmCols = ['codos', 'codint', 'razonSocial', 'cuit', 'estado', 'acciones'];
  searchFarm = '';

  // PLAN MONODROGA
  planMonodrogasList: PlanMonodrogaInterface[] = [];
  planMonodrogasDataSource = new MatTableDataSource<PlanMonodrogaInterface>([]);
  pmCols = ['plan', 'monodroga', 'laboratorio', 'estado', 'acciones'];
  searchPm = '';

  @ViewChild('planPaginator') planPaginator!: MatPaginator;
  @ViewChild('farmPaginator') farmPaginator!: MatPaginator;
  @ViewChild('pmPaginator') pmPaginator!: MatPaginator;

  ngOnInit() {
    this.service.getAllObraSociales().subscribe(res => {
      this.osDataSource.data = res;
      if (res.length > 0) {
        this.selectObraSocial(res[0]);
      }
    });
  }

  applyOsFilter() {
    this.osDataSource.filter = this.searchOS.trim().toLowerCase();
  }

  selectObraSocial(os: ObraSocialInterface) {
    this.selectedOS = os;
    this.loadPlanes();
    this.loadFarmaciasOs();
    this.loadPlanMonodrogas();
  }

  loadPlanes() {
    if (!this.selectedOS) return;
    this.service.getPlanesByObraSocial(this.selectedOS.id!).subscribe(res => {
      this.planesList = res;
      this.planesDataSource.data = res;
      this.planesDataSource.paginator = this.planPaginator;
    });
  }

  loadFarmaciasOs() {
    if (!this.selectedOS) return;
    this.service.getFarmaciasOsByObraSocial(this.selectedOS.id!).subscribe(res => {
      this.farmaciasOsList = res;
      this.farmaciasOsDataSource.data = res;
      this.farmaciasOsDataSource.paginator = this.farmPaginator;
    });
  }

  loadPlanMonodrogas() {
    if (!this.selectedOS) return;
    this.service.getPlanMonodrogasByObraSocial(this.selectedOS.id!).subscribe(res => {
      this.planMonodrogasList = res;
      this.planMonodrogasDataSource.data = res;
      this.planMonodrogasDataSource.paginator = this.pmPaginator;
    });
  }

  applyPlanFilter() { this.planesDataSource.filter = this.searchPlan.trim().toLowerCase(); }
  applyFarmFilter() { this.farmaciasOsDataSource.filter = this.searchFarm.trim().toLowerCase(); }
  applyPmFilter() { this.planMonodrogasDataSource.filter = this.searchPm.trim().toLowerCase(); }

  // MODALES
  openPlanForm(item?: PlanCoberturaInterface) {
    this.dialog.open(PlanFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS!.id, item } }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Plan guardado con éxito', 'Aceptar', { duration: 2500 });
        this.loadPlanes();
      }
    });
  }

  onDeletePlan(item: PlanCoberturaInterface) {
    if (confirm(`¿Confirma dar de baja lógica al plan '${item.descripcion}'?`)) {
      this.service.deletePlan(item.id!).subscribe(() => {
        this.snack.open('Plan dado de baja correctamente', 'Aceptar', { duration: 2500 });
        this.loadPlanes();
      });
    }
  }

  openFarmaciaOsForm(item?: FarmaciaOsInterface) {
    this.dialog.open(FarmaciaOsFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS!.id, item } }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Farmacia asociada a Obra Social con éxito', 'Aceptar', { duration: 2500 });
        this.loadFarmaciasOs();
      }
    });
  }

  onDeleteFarmaciaOs(item: FarmaciaOsInterface) {
    if (confirm(`¿Confirma dar de baja lógica el convenio con '${item.farmaciaRazonSocial}'?`)) {
      this.service.deleteFarmaciaOs(item.id!).subscribe(() => {
        this.snack.open('Convenio dado de baja correctamente', 'Aceptar', { duration: 2500 });
        this.loadFarmaciasOs();
      });
    }
  }

  openPlanMonodrogaForm(item?: PlanMonodrogaInterface) {
    this.dialog.open(PlanMonodrogaFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS!.id, item } }).afterClosed().subscribe(res => {
      if (res) {
        this.snack.open('Regla Plan/Monodroga guardada con éxito', 'Aceptar', { duration: 2500 });
        this.loadPlanMonodrogas();
      }
    });
  }

  onDeletePlanMonodroga(item: PlanMonodrogaInterface) {
    if (confirm(`¿Confirma dar de baja la regla para '${item.monodrogaNombre}'?`)) {
      this.service.deletePlanMonodroga(item.id!).subscribe(() => {
        this.snack.open('Regla dada de baja correctamente', 'Aceptar', { duration: 2500 });
        this.loadPlanMonodrogas();
      });
    }
  }
}
