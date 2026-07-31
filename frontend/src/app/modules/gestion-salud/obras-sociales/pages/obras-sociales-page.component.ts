import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
    CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatTabsModule, MatCardModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Gestión de Obras Sociales</h1>
          <p class="page-subtitle">Padrón de Obras Sociales y Administración de Planes, Farmacias OS y Monodrogas</p>
        </div>
      </div>

      <div class="main-layout-grid">
        <!-- MAESTRO: LISTADO Y BOTÓN NUEVA OBRA SOCIAL -->
        <mat-card class="master-card">
          <mat-card-header class="card-hdr">
            <div class="master-hdr-content">
              <mat-card-title class="hdr-title"><mat-icon color="primary">local_hospital</mat-icon> Obras Sociales</mat-card-title>
              <button mat-flat-button color="primary" class="btn-new-os" (click)="onNuevaObraSocial()">
                <mat-icon>add</mat-icon> Nueva Obra Social
              </button>
            </div>
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
                  <span class="badge" [ngClass]="os.activo ? 'badge-active' : 'badge-inactive'">
                    {{ os.activo ? 'ACTIVA' : 'INACTIVA' }}
                  </span>
                </div>
                <div class="os-name">{{ os.descripcion }}</div>
                <div class="os-cuit">CUIT: {{ os.cuit }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- DETALLE: FORMULARIO MAESTRO (ALTA / EDICIÓN) + PESTAÑAS HIJAS -->
        <mat-card class="detail-card" *ngIf="formOS">
          <mat-card-header class="card-hdr" [ngClass]="isEditMode ? 'hdr-selected' : 'hdr-new'">
            <div class="detail-hdr-box">
              <div>
                <span class="selected-tag">{{ isEditMode ? 'Editando Obra Social:' : 'Modo Alta:' }}</span>
                <h2 class="selected-title">{{ isEditMode ? selectedOS?.descripcion : 'Crear Nueva Obra Social' }}</h2>
              </div>
              <button mat-flat-button color="primary" class="btn-save-os" [disabled]="formOS.invalid" (click)="onGuardarObraSocial()">
                <mat-icon>save</mat-icon> {{ isEditMode ? 'Guardar Cambios' : 'Guardar Obra Social' }}
              </button>
            </div>
          </mat-card-header>

          <mat-card-content class="card-cnt">
            <!-- FORMULARIO MAESTRO DE OBRA SOCIAL -->
            <form [formGroup]="formOS" class="os-form-grid">
              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Código (Auto)</mat-label>
                <input matInput formControlName="codigo" readonly class="code-input">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-two-third">
                <mat-label>Descripción / Razón Social *</mat-label>
                <input matInput formControlName="descripcion" placeholder="Ej: OSDE ORGANIZACIÓN DE SERVICIOS DIRECTOS EMPRESARIOS">
                <mat-error *ngIf="formOS.get('descripcion')?.hasError('required')">Descripción obligatoria</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Sigla / Nombre Corto</mat-label>
                <input matInput formControlName="sigla" placeholder="Ej: OSDE">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>CUIT</mat-label>
                <input matInput formControlName="cuit" placeholder="30-54674125-9">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>País *</mat-label>
                <mat-select formControlName="paisId">
                  <mat-option [value]="1">ARGENTINA</mat-option>
                </mat-select>
                <mat-error *ngIf="formOS.get('paisId')?.hasError('required')">País obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Provincia</mat-label>
                <input matInput formControlName="provinciaNombre" placeholder="BUENOS AIRES">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Localidad / Ciudad</mat-label>
                <input matInput formControlName="localidad" placeholder="CABA">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Dirección</mat-label>
                <input matInput formControlName="direccion" placeholder="AV. CORRIENTES 1234">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefonos" placeholder="011-4321-8800">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Mail</mat-label>
                <input matInput formControlName="mail" placeholder="contacto@obrasocial.com.ar">
                <mat-error *ngIf="formOS.get('mail')?.hasError('email')">Formato de correo inválido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-third">
                <mat-label>Estado *</mat-label>
                <mat-select formControlName="activo">
                  <mat-option [value]="true">Activo</mat-option>
                  <mat-option [value]="false">Inactivo</mat-option>
                </mat-select>
              </mat-form-field>
            </form>

            <hr class="section-divider">

            <!-- PESTAÑAS HIJAS (HABILITADAS SOLO EN MODO EDICIÓN / DESPUÉS DE GUARDAR) -->
            <div *ngIf="!isEditMode" class="alert-disabled-tabs">
              <mat-icon class="alert-ic">info</mat-icon>
              <span>Debe guardar primero la Obra Social para administrar sus datos relacionados.</span>
            </div>

            <mat-tab-group animationDuration="150ms" [selectedIndex]="0">
              
              <!-- PESTAÑA 1: PLANES COBERTURA -->
              <mat-tab [disabled]="!isEditMode">
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">assignment</mat-icon> Planes Cobertura ({{ planesList.length }})
                </ng-template>

                <div class="tab-content" *ngIf="isEditMode">
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
              <mat-tab [disabled]="!isEditMode">
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">local_pharmacy</mat-icon> Farmacias OS ({{ farmaciasOsList.length }})
                </ng-template>

                <div class="tab-content" *ngIf="isEditMode">
                  <div class="sub-hdr">
                    <mat-form-field appearance="outline" class="search-sm">
                      <mat-label>Buscar Farmacia OS...</mat-label>
                      <input matInput [(ngModel)]="searchFarm" (keyup)="applyFarmFilter()">
                    </mat-form-field>
                    <button mat-flat-button color="primary" (click)="openFarmaciaOsForm()"><mat-icon>add</mat-icon> Asociar Farmacia</button>
                  </div>

                  <table mat-table [dataSource]="farmaciasOsDataSource" matSort class="full-width-table">
                    <ng-container matColumnDef="codos"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código OS (CODFAROS)</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{ el.codigoFarmaciaOs }}</td></ng-container>
                    
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
              <mat-tab [disabled]="!isEditMode">
                <ng-template mat-tab-label>
                  <mat-icon class="tab-ic">science</mat-icon> Plan / Monodroga ({{ planMonodrogasList.length }})
                </ng-template>

                <div class="tab-content" *ngIf="isEditMode">
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
    .master-hdr-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    .hdr-title { font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 8px; margin: 0; }
    .btn-new-os { font-weight: 700; height: 32px; font-size: 0.8rem; }
    .hdr-selected { background: #F0F9FF; }
    .hdr-new { background: #FEF3C7; }
    .detail-hdr-box { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    .selected-tag { font-size: 0.72rem; font-weight: 800; color: #0284C7; text-transform: uppercase; }
    .selected-title { font-size: 1.1rem; font-weight: 800; color: #0369A1; margin: 0; }
    .btn-save-os { font-weight: 700; height: 36px; background-color: var(--brand-primary) !important; }
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
    .os-form-grid { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; margin-bottom: 12px; }
    .col-third { width: calc(33.33% - 7px); }
    .col-two-third { width: calc(66.66% - 3px); }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .section-divider { border: 0; border-top: 1px solid var(--border-color); margin: 16px 0; }
    .alert-disabled-tabs { background: #FFFBEB; border: 1px solid #FCD34D; color: #B45309; padding: 10px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .alert-ic { font-size: 18px; width: 18px; height: 18px; }
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
  private fb = inject(FormBuilder);
  private service = inject(ObrasSocialesService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  osDataSource = new MatTableDataSource<ObraSocialInterface>([]);
  selectedOS: ObraSocialInterface | null = null;
  searchOS = '';
  isEditMode = false;

  formOS = this.fb.group({
    id: [null as number | null],
    codigo: ['OS-AUTO'],
    descripcion: ['', Validators.required],
    sigla: [''],
    cuit: [''],
    paisId: [1, Validators.required],
    provinciaNombre: [''],
    localidad: [''],
    direccion: [''],
    telefonos: [''],
    mail: ['', Validators.email],
    activo: [true, Validators.required]
  });

  // PLANES
  planesList: PlanCoberturaInterface[] = [];
  planesDataSource = new MatTableDataSource<PlanCoberturaInterface>([]);
  planCols = ['codigo', 'descripcion', 'cobertura', 'copago', 'estado', 'acciones'];
  searchPlan = '';

  // FARMACIAS OS
  farmaciasOsList: FarmaciaOsInterface[] = [];
  farmaciasOsDataSource = new MatTableDataSource<FarmaciaOsInterface>([]);
  farmCols = ['codos', 'razonSocial', 'cuit', 'estado', 'acciones'];
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
    this.loadObrasSociales();
  }

  loadObrasSociales() {
    this.service.getAllObraSociales().subscribe(res => {
      this.osDataSource.data = res;
      if (res.length > 0 && !this.selectedOS) {
        this.selectObraSocial(res[0]);
      }
    });
  }

  applyOsFilter() {
    this.osDataSource.filter = this.searchOS.trim().toLowerCase();
  }

  onNuevaObraSocial() {
    this.selectedOS = null;
    this.isEditMode = false;
    this.formOS.reset({
      id: null,
      codigo: 'OS-NEW',
      descripcion: '',
      sigla: '',
      cuit: '',
      paisId: 1,
      provinciaNombre: '',
      localidad: '',
      direccion: '',
      telefonos: '',
      mail: '',
      activo: true
    });
    this.planesList = []; this.planesDataSource.data = [];
    this.farmaciasOsList = []; this.farmaciasOsDataSource.data = [];
    this.planMonodrogasList = []; this.planMonodrogasDataSource.data = [];
  }

  selectObraSocial(os: ObraSocialInterface) {
    this.selectedOS = os;
    this.isEditMode = true;
    this.formOS.patchValue({
      id: os.id,
      codigo: os.codigo,
      descripcion: os.descripcion,
      sigla: os.sigla || '',
      cuit: os.cuit,
      paisId: 1,
      provinciaNombre: os.provinciaNombre || '',
      localidad: os.localidad || '',
      direccion: os.direccion || '',
      telefonos: os.telefonos || '',
      mail: os.mail || '',
      activo: os.activo
    });

    this.loadPlanes();
    this.loadFarmaciasOs();
    this.loadPlanMonodrogas();
  }

  onGuardarObraSocial() {
    if (this.formOS.valid) {
      const raw = this.formOS.getRawValue();
      const payload: ObraSocialInterface = {
        ...(raw.id ? { id: raw.id } : {}),
        codigo: raw.codigo || 'OS-AUTO',
        descripcion: raw.descripcion!.trim().toUpperCase(),
        sigla: raw.sigla ? raw.sigla.trim().toUpperCase() : '',
        cuit: raw.cuit ? raw.cuit.trim() : '',
        provinciaNombre: raw.provinciaNombre ? raw.provinciaNombre.trim().toUpperCase() : '',
        localidad: raw.localidad ? raw.localidad.trim().toUpperCase() : '',
        direccion: raw.direccion ? raw.direccion.trim().toUpperCase() : '',
        telefonos: raw.telefonos ? raw.telefonos.trim() : '',
        mail: raw.mail ? raw.mail.trim().toLowerCase() : '',
        activo: raw.activo!
      };

      this.service.saveObraSocial(payload).subscribe({
        next: (savedOS) => {
          this.snack.open('Obra Social guardada exitosamente', 'Aceptar', { duration: 2500 });
          this.service.getAllObraSociales().subscribe(res => {
            this.osDataSource.data = res;
            const updated = res.find(x => x.id === savedOS.id) || savedOS;
            this.selectObraSocial(updated);
          });
        },
        error: (err) => alert(err.message)
      });
    }
  }

  loadPlanes() {
    if (!this.selectedOS || !this.selectedOS.id) return;
    this.service.getPlanesByObraSocial(this.selectedOS.id).subscribe(res => {
      this.planesList = res;
      this.planesDataSource.data = res;
      this.planesDataSource.paginator = this.planPaginator;
    });
  }

  loadFarmaciasOs() {
    if (!this.selectedOS || !this.selectedOS.id) return;
    this.service.getFarmaciasOsByObraSocial(this.selectedOS.id).subscribe(res => {
      this.farmaciasOsList = res;
      this.farmaciasOsDataSource.data = res;
      this.farmaciasOsDataSource.paginator = this.farmPaginator;
    });
  }

  loadPlanMonodrogas() {
    if (!this.selectedOS || !this.selectedOS.id) return;
    this.service.getPlanMonodrogasByObraSocial(this.selectedOS.id).subscribe(res => {
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
    if (!this.selectedOS?.id) return;
    this.dialog.open(PlanFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS.id, item } }).afterClosed().subscribe(res => {
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
        this.planesList = this.planesList.filter(x => x.id !== item.id);
        this.planesDataSource.data = this.planesList.filter(x => x.activo !== false);
      });
    }
  }

  openFarmaciaOsForm(item?: FarmaciaOsInterface) {
    if (!this.selectedOS?.id) return;
    this.dialog.open(FarmaciaOsFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS.id, item } }).afterClosed().subscribe(res => {
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
        this.farmaciasOsList = this.farmaciasOsList.filter(x => x.id !== item.id);
        this.farmaciasOsDataSource.data = this.farmaciasOsList.filter(x => x.activo !== false);
      });
    }
  }

  openPlanMonodrogaForm(item?: PlanMonodrogaInterface) {
    if (!this.selectedOS?.id) return;
    this.dialog.open(PlanMonodrogaFormDialogComponent, { width: '560px', data: { obraSocialId: this.selectedOS.id, item } }).afterClosed().subscribe(res => {
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
        this.planMonodrogasList = this.planMonodrogasList.filter(x => x.id !== item.id);
        this.planMonodrogasDataSource.data = this.planMonodrogasList.filter(x => x.activo !== false);
      });
    }
  }
}
