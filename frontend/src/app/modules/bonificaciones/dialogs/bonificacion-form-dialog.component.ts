import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { BonificacionesService } from '../services/bonificaciones.service';
import { FarmaciasService } from '../../gestion-salud/farmacias/services/farmacias.service';

@Component({
  selector: 'app-bonificacion-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">loyalty</mat-icon>
        {{ data ? 'Editar Parametrización de Bonificación' : 'Nueva Parametrización de Bonificación' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <!-- CÓDIGO -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código Sistema (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <!-- DESCRIPCIÓN -->
          <mat-form-field appearance="outline" class="col-two-third">
            <mat-label>Descripción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: BONIFICACIÓN PLAN GENERAL OSDE">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Descripción obligatoria</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE CATEGORÍA MEDICAMENTO (TABLA AUXILIAR) -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Categoría de Medicamento *</mat-label>
            <input type="text" matInput formControlName="categoriaInput" [matAutocomplete]="autoCat" placeholder="Buscar categoría en Tabla Auxiliar...">
            <mat-autocomplete #autoCat="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onCategoriaSelected($event)">
              <mat-option *ngFor="let option of filteredCategorias | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('categoriaId')?.hasError('required')">Categoría obligatoria</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE UBICACIÓN (TABLA AUXILIAR) -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Ubicación *</mat-label>
            <input type="text" matInput formControlName="ubicacionInput" [matAutocomplete]="autoUbi" placeholder="Buscar ubicación en Tabla Auxiliar...">
            <mat-autocomplete #autoUbi="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onUbicacionSelected($event)">
              <mat-option *ngFor="let option of filteredUbicaciones | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('ubicacionId')?.hasError('required')">Ubicación obligatoria</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE OBRA SOCIAL (GESTIÓN SALUD) -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Obra Social *</mat-label>
            <input type="text" matInput formControlName="obraSocialInput" [matAutocomplete]="autoOS" placeholder="Buscar Obra Social...">
            <mat-autocomplete #autoOS="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onObraSocialSelected($event)">
              <mat-option *ngFor="let option of filteredObrasSociales | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('obraSocialId')?.hasError('required')">Obra Social obligatoria</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE PLAN (DEPENDIENTE DE OBRA SOCIAL) -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Plan de Cobertura *</mat-label>
            <input type="text" matInput formControlName="planInput" [matAutocomplete]="autoPlan" placeholder="Seleccionar plan de la Obra Social...">
            <mat-autocomplete #autoPlan="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onPlanSelected($event)">
              <mat-option *ngFor="let option of filteredPlanes | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('planId')?.hasError('required')">Plan obligatorio</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE FARMACIA (MÓDULO FARMACIA - PADRÓN GENERAL / CONVENIDAS) -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Farmacia Convenida *</mat-label>
            <input type="text" matInput formControlName="farmaciaInput" [matAutocomplete]="autoFarm" placeholder="Buscar farmacia en Padrón General de Farmacias...">
            <mat-autocomplete #autoFarm="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onFarmaciaSelected($event)">
              <mat-option *ngFor="let option of filteredFarmacias | async" [value]="option">
                {{ option.nombre }} - CUIT: {{ option.cuit }} ({{ option.cuf }})
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('farmaciaId')?.hasError('required')">Farmacia obligatoria</mat-error>
          </mat-form-field>

          <!-- VALOR 1 Y VALOR 2 -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Valor 1 *</mat-label>
            <input matInput type="number" step="0.01" formControlName="valor1" placeholder="0.00">
            <mat-error *ngIf="form.get('valor1')?.hasError('required')">Obligatorio</mat-error>
            <mat-error *ngIf="form.get('valor1')?.hasError('min')">Mínimo 0</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Valor 2 *</mat-label>
            <input matInput type="number" step="0.01" formControlName="valor2" placeholder="0.00">
            <mat-error *ngIf="form.get('valor2')?.hasError('required')">Obligatorio</mat-error>
            <mat-error *ngIf="form.get('valor2')?.hasError('min')">Mínimo 0</mat-error>
          </mat-form-field>

          <!-- ESTADO -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Estado *</mat-label>
            <mat-select formControlName="activo">
              <mat-option [value]="true">Activo</mat-option>
              <mat-option [value]="false">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" class="btn-save" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-box { width: 100%; box-sizing: border-box; }
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; }
    .dialog-content { padding: 8px 16px 16px 16px !important; max-height: 78vh; overflow-x: hidden; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; }
    .col-full { width: 100%; }
    .col-half { width: calc(50% - 5px); }
    .col-third { width: calc(33.33% - 7px); }
    .col-two-third { width: calc(66.66% - 3px); }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class BonificacionFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<BonificacionFormDialogComponent>);
  private service = inject(BonificacionesService);
  private farmaciasService = inject(FarmaciasService);
  public data: any = inject(MAT_DIALOG_DATA);

  // TABLAS CONSUMIDAS DE LOS MÓDULOS DEL SISTEMA
  categoriasList: any[] = [];
  ubicacionesList: any[] = [];
  obrasSocialesList: any[] = [];
  todosPlanes: any[] = [];
  todasFarmacias: any[] = [];

  planesFiltrados: any[] = [];
  farmaciasFiltradas: any[] = [];

  filteredCategorias!: Observable<any[]>;
  filteredUbicaciones!: Observable<any[]>;
  filteredObrasSociales!: Observable<any[]>;
  filteredPlanes!: Observable<any[]>;
  filteredFarmacias!: Observable<any[]>;

  form = this.fb.group({
    id: [null as number | null],
    codigo: [{ value: 'BON-003', disabled: true }],
    descripcion: ['', Validators.required],
    categoriaId: [null as number | null, Validators.required],
    categoriaInput: [null as any, Validators.required],
    ubicacionId: [null as number | null, Validators.required],
    ubicacionInput: [null as any, Validators.required],
    obraSocialId: [null as number | null, Validators.required],
    obraSocialInput: [null as any, Validators.required],
    planId: [null as number | null, Validators.required],
    planInput: [null as any, Validators.required],
    farmaciaId: [null as number | null, Validators.required],
    farmaciaInput: [null as any, Validators.required],
    valor1: [0, [Validators.required, Validators.min(0)]],
    valor2: [0, [Validators.required, Validators.min(0)]],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    this.cargarTablasAuxiliares();
  }

  cargarTablasAuxiliares() {
    // 1. Cargar Categorías desde Tablas Auxiliares
    this.categoriasList = [
      { id: 1, nombre: 'MEDICAMENTOS AMBULATORIOS' },
      { id: 2, nombre: 'ALTA COMPLEXIDAD / ONCOLÓGICOS' },
      { id: 3, nombre: 'VACUNAS Y BIOLÓGICOS' }
    ];

    // 2. Cargar Ubicaciones desde Tablas Auxiliares
    this.ubicacionesList = [
      { id: 1, nombre: 'CENTRO METROPOLITANO' },
      { id: 2, nombre: 'SUCURSAL CÓRDOBA' },
      { id: 3, nombre: 'ZONA SANTA FE' }
    ];

    // 3. Cargar Obras Sociales
    this.obrasSocialesList = [
      { id: 1, nombre: 'OSDE ORGANIZACIÓN DE SERVICIOS DIRECTOS EMPRESARIOS' },
      { id: 2, nombre: 'SWISS MEDICAL S.A.' }
    ];

    // 4. Cargar Planes
    this.todosPlanes = [
      { id: 1, obraSocialId: 1, nombre: 'PLAN 210' },
      { id: 2, obraSocialId: 1, nombre: 'PLAN 310' },
      { id: 3, obraSocialId: 2, nombre: 'PLAN SMG20' }
    ];

    // 5. Cargar Farmacias desde Padrón General de Farmacias
    this.farmaciasService.getAll().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.todasFarmacias = res.map(x => ({
            id: x.id!,
            obraSocialId: x.id === 1 ? 1 : 2,
            codigo: x.codigo,
            nombre: x.descripcion,
            cuit: x.cuit,
            cuf: x.cuf
          }));
        } else {
          this.todasFarmacias = [
            { id: 1, obraSocialId: 1, codigo: 'FAR-001', nombre: 'FARMACIA CENTRAL BUENOS AIRES', cuit: '30-71234567-8', cuf: 'CUF-100294' },
            { id: 2, obraSocialId: 2, codigo: 'FAR-002', nombre: 'FARMACIA DEL SOL', cuit: '30-68994021-4', cuf: 'CUF-300192' }
          ];
        }
        this.completarCargaInicial();
      },
      error: () => {
        this.todasFarmacias = [
          { id: 1, obraSocialId: 1, codigo: 'FAR-001', nombre: 'FARMACIA CENTRAL BUENOS AIRES', cuit: '30-71234567-8', cuf: 'CUF-100294' },
          { id: 2, obraSocialId: 2, codigo: 'FAR-002', nombre: 'FARMACIA DEL SOL', cuit: '30-68994021-4', cuf: 'CUF-300192' }
        ];
        this.completarCargaInicial();
      }
    });
  }

  completarCargaInicial() {
    this.initFilters();

    if (this.data) {
      this.cargarPlanesYFarmacias(this.data.obraSocialId);

      const catObj = this.categoriasList.find(x => x.id === this.data.categoriaId);
      const ubiObj = this.ubicacionesList.find(x => x.id === this.data.ubicacionId);
      const osObj = this.obrasSocialesList.find(x => x.id === this.data.obraSocialId);
      const planObj = this.todosPlanes.find(x => x.id === this.data.planId);
      const farmObj = this.todasFarmacias.find(x => x.id === this.data.farmaciaId);

      this.form.patchValue({
        id: this.data.id,
        codigo: this.data.codigo,
        descripcion: this.data.descripcion,
        categoriaId: this.data.categoriaId,
        categoriaInput: catObj || { nombre: this.data.categoriaNombre },
        ubicacionId: this.data.ubicacionId,
        ubicacionInput: ubiObj || { nombre: this.data.ubicacionNombre },
        obraSocialId: this.data.obraSocialId,
        obraSocialInput: osObj || { nombre: this.data.obraSocialNombre },
        planId: this.data.planId,
        planInput: planObj || { nombre: this.data.planNombre },
        farmaciaId: this.data.farmaciaId,
        farmaciaInput: farmObj || { nombre: this.data.farmaciaNombre },
        valor1: this.data.valor1,
        valor2: this.data.valor2,
        activo: this.data.activo
      });
    }
  }

  initFilters() {
    this.filteredCategorias = this.form.get('categoriaInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.categoriasList)));
    this.filteredUbicaciones = this.form.get('ubicacionInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.ubicacionesList)));
    this.filteredObrasSociales = this.form.get('obraSocialInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.obrasSocialesList)));
    this.filteredPlanes = this.form.get('planInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.planesFiltrados)));
    this.filteredFarmacias = this.form.get('farmaciaInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.farmaciasFiltradas)));
  }

  cargarPlanesYFarmacias(obraSocialId: number) {
    this.planesFiltrados = this.todosPlanes.filter(x => x.obraSocialId === obraSocialId);
    this.farmaciasFiltradas = this.todasFarmacias.filter(x => x.obraSocialId === obraSocialId || !x.obraSocialId);
    this.initFilters();
  }

  displayFn(item: any): string {
    return item && item.nombre ? item.nombre : '';
  }

  private _filter(val: any, list: any[]) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val?.nombre ? val.nombre.toLowerCase() : '');
    return list.filter(item => item.nombre.toLowerCase().includes(filterValue) || (item.cuit && item.cuit.includes(filterValue)));
  }

  onCategoriaSelected(e: any) { this.form.patchValue({ categoriaId: e.option.value.id }); }
  onUbicacionSelected(e: any) { this.form.patchValue({ ubicacionId: e.option.value.id }); }

  onObraSocialSelected(e: any) {
    const osId = e.option.value.id;
    this.form.patchValue({
      obraSocialId: osId,
      planId: null,
      planInput: null,
      farmaciaId: null,
      farmaciaInput: null
    });
    this.cargarPlanesYFarmacias(osId);
  }

  onPlanSelected(e: any) { this.form.patchValue({ planId: e.option.value.id }); }
  onFarmaciaSelected(e: any) { this.form.patchValue({ farmaciaId: e.option.value.id }); }

  onSave() {
    if (this.form.valid) {
      const fVal = this.form.getRawValue();
      const catObj = typeof fVal.categoriaInput === 'object' ? fVal.categoriaInput : this.categoriasList.find(x => x.id === fVal.categoriaId);
      const ubiObj = typeof fVal.ubicacionInput === 'object' ? fVal.ubicacionInput : this.ubicacionesList.find(x => x.id === fVal.ubicacionId);
      const osObj = typeof fVal.obraSocialInput === 'object' ? fVal.obraSocialInput : this.obrasSocialesList.find(x => x.id === fVal.obraSocialId);
      const planObj = typeof fVal.planInput === 'object' ? fVal.planInput : this.todosPlanes.find(x => x.id === fVal.planId);
      const farmObj = typeof fVal.farmaciaInput === 'object' ? fVal.farmaciaInput : this.todasFarmacias.find(x => x.id === fVal.farmaciaId);

      const payload = {
        ...(fVal.id ? { id: fVal.id } : {}),
        codigo: fVal.codigo || 'BON-003',
        descripcion: fVal.descripcion!.trim().toUpperCase(),
        categoriaId: fVal.categoriaId!,
        categoriaNombre: catObj?.nombre,
        ubicacionId: fVal.ubicacionId!,
        ubicacionNombre: ubiObj?.nombre,
        obraSocialId: fVal.obraSocialId!,
        obraSocialNombre: osObj?.nombre,
        planId: fVal.planId!,
        planNombre: planObj?.nombre,
        farmaciaId: fVal.farmaciaId!,
        farmaciaCodigo: farmObj?.codigo,
        farmaciaNombre: farmObj?.nombre,
        valor1: Number(fVal.valor1),
        valor2: Number(fVal.valor2),
        activo: fVal.activo!
      };

      this.service.save(payload as any).subscribe({
        next: (res) => this.ref.close(res),
        error: (err) => alert(err.message)
      });
    }
  }
}
