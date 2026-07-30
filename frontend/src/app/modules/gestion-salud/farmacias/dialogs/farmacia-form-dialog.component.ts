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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FarmaciasService } from '../services/farmacias.service';

@Component({
  selector: 'app-farmacia-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">local_pharmacy</mat-icon>
        {{ data ? 'Editar Farmacia' : 'Nueva Farmacia en Padrón' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <!-- CÓDIGO AUTO & FECHA ALTA -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código Sistema (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>CUIT *</mat-label>
            <input matInput formControlName="cuit" placeholder="30-71234567-8">
            <mat-error *ngIf="form.get('cuit')?.hasError('required')">CUIT obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>CUF (Código Único) *</mat-label>
            <input matInput formControlName="cuf" placeholder="CUF-100294">
            <mat-error *ngIf="form.get('cuf')?.hasError('required')">CUF obligatorio</mat-error>
          </mat-form-field>

          <!-- DESCRIPCIÓN COMERCIAL -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Descripción Comercial / Razon Social *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: FARMACIA CENTRAL BUENOS AIRES">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE PAÍS Y PROVINCIA -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>País *</mat-label>
            <input type="text" matInput formControlName="paisInput" [matAutocomplete]="autoPais" placeholder="Buscar país...">
            <mat-autocomplete #autoPais="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onPaisSelected($event)">
              <mat-option *ngFor="let option of filteredPaises | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('paisId')?.hasError('required')">País obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Provincia *</mat-label>
            <input type="text" matInput formControlName="provinciaInput" [matAutocomplete]="autoProv" placeholder="Buscar provincia...">
            <mat-autocomplete #autoProv="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onProvSelected($event)">
              <mat-option *ngFor="let option of filteredProvincias | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('provinciaId')?.hasError('required')">Provincia obligatoria</mat-error>
          </mat-form-field>

          <!-- LOCALIDAD, CIUDAD, DIRECCIÓN Y NÚMERO -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Localidad</mat-label>
            <input matInput formControlName="localidad" placeholder="Ej: PALERMO">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Ciudad</mat-label>
            <input matInput formControlName="ciudad" placeholder="Ej: CABA">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="direccion" placeholder="Ej: AV. SANTA FE">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Número</mat-label>
            <input matInput formControlName="numero" placeholder="3200">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código Postal</mat-label>
            <input matInput formControlName="codigoPostal" placeholder="1425">
          </mat-form-field>

          <!-- CONTACTO, TELÉFONOS, MAIL, PAMI -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Teléfonos</mat-label>
            <input matInput formControlName="telefonos" placeholder="011-4800-1122">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Mail Contacto</mat-label>
            <input matInput formControlName="mail" placeholder="contacto@farmacia.com">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>PAMI / Código Afiliación</mat-label>
            <input matInput formControlName="pami" placeholder="PAM-9481">
          </mat-form-field>

          <!-- AUTOCOMPLETE UBICACIÓN, ZONA, DROGUERÍA -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Ubicación *</mat-label>
            <input type="text" matInput formControlName="ubicacionInput" [matAutocomplete]="autoUbi">
            <mat-autocomplete #autoUbi="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onUbiSelected($event)">
              <mat-option *ngFor="let option of filteredUbicaciones | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('ubicacionId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Zona *</mat-label>
            <input type="text" matInput formControlName="zonaInput" [matAutocomplete]="autoZona">
            <mat-autocomplete #autoZona="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onZonaSelected($event)">
              <mat-option *ngFor="let option of filteredZonas | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('zonaId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Droguería *</mat-label>
            <input type="text" matInput formControlName="drogueriaInput" [matAutocomplete]="autoDrog">
            <mat-autocomplete #autoDrog="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onDrogSelected($event)">
              <mat-option *ngFor="let option of filteredDroguerias | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('drogueriaId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <!-- BANCARIO -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Responsable / Director Técnico</mat-label>
            <input matInput formControlName="responsableDT" placeholder="DRA. MARÍA GONZÁLEZ">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Titular Cuenta Bancaria</mat-label>
            <input matInput formControlName="titularCuenta" placeholder="FARMACIA S.A.">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Banco</mat-label>
            <input matInput formControlName="banco" placeholder="BANCO NACIÓN">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>CBU (22 dígitos)</mat-label>
            <input matInput formControlName="cbu" placeholder="0110599520000001234567">
          </mat-form-field>

          <!-- CONFIGURACIÓN ADICIONAL -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Modificar Bonificación</mat-label>
            <mat-select formControlName="modificarBonificacion">
              <mat-option value="Sí">Sí</mat-option>
              <mat-option value="No">No</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Estado en Padrón *</mat-label>
            <mat-select formControlName="activo">
              <mat-option [value]="true">Activo</mat-option>
              <mat-option [value]="false">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- TEXTAREAS -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Estado Legal / Habilitación ANMAT</mat-label>
            <textarea matInput formControlName="estadoLegal" rows="2"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="2"></textarea>
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
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class FarmaciaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<FarmaciaFormDialogComponent>);
  private service = inject(FarmaciasService);
  public data: any = inject(MAT_DIALOG_DATA);

  paisesList = [{ id: 1, nombre: 'ARGENTINA' }];
  provinciasList = [{ id: 1, nombre: 'BUENOS AIRES' }, { id: 2, nombre: 'CÓRDOBA' }, { id: 3, nombre: 'SANTA FE' }];
  ubicacionesList = [{ id: 1, nombre: 'CENTRO METROPOLITANO' }, { id: 2, nombre: 'SUCURSAL CÓRDOBA' }];
  zonasList = [{ id: 1, nombre: 'ZONA NORTE' }, { id: 2, nombre: 'ZONA CENTRO' }];
  drogueriasList = [{ id: 1, nombre: 'DROGUERÍA MONROE' }, { id: 2, nombre: 'DROGUERÍA DEL SUD' }];

  filteredPaises!: Observable<{ id: number; nombre: string }[]>;
  filteredProvincias!: Observable<{ id: number; nombre: string }[]>;
  filteredUbicaciones!: Observable<{ id: number; nombre: string }[]>;
  filteredZonas!: Observable<{ id: number; nombre: string }[]>;
  filteredDroguerias!: Observable<{ id: number; nombre: string }[]>;

  form = this.fb.group({
    id: [null],
    codigo: [{ value: 'FAR-003', disabled: true }],
    descripcion: ['', Validators.required],
    paisId: [1, Validators.required],
    paisInput: [{ id: 1, nombre: 'ARGENTINA' }, Validators.required],
    provinciaId: [1, Validators.required],
    provinciaInput: [{ id: 1, nombre: 'BUENOS AIRES' }, Validators.required],
    localidad: [''],
    ciudad: [''],
    direccion: [''],
    numero: [''],
    codigoPostal: [''],
    telefonos: [''],
    pami: [''],
    contactos: [''],
    mail: ['', Validators.email],
    ubicacionId: [1, Validators.required],
    ubicacionInput: [{ id: 1, nombre: 'CENTRO METROPOLITANO' }, Validators.required],
    zonaId: [1, Validators.required],
    zonaInput: [{ id: 1, nombre: 'ZONA NORTE' }, Validators.required],
    responsableDT: [''],
    cuit: ['', Validators.required],
    banco: [''],
    cuentaBancaria: [''],
    titularCuenta: [''],
    cbu: [''],
    modificarBonificacion: ['Sí'],
    drogueriaId: [1, Validators.required],
    drogueriaInput: [{ id: 1, nombre: 'DROGUERÍA MONROE' }, Validators.required],
    estadoLegal: [''],
    observaciones: [''],
    cuf: ['', Validators.required],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    this.initFilters();
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.codigo) this.form.get('codigo')?.setValue(this.data.codigo);
    }
  }

  initFilters() {
    this.filteredPaises = this.form.get('paisInput')!.valueChanges.pipe(startWith(''), map((v: any) => this._filter(v, this.paisesList)));
    this.filteredProvincias = this.form.get('provinciaInput')!.valueChanges.pipe(startWith(''), map((v: any) => this._filter(v, this.provinciasList)));
    this.filteredUbicaciones = this.form.get('ubicacionInput')!.valueChanges.pipe(startWith(''), map((v: any) => this._filter(v, this.ubicacionesList)));
    this.filteredZonas = this.form.get('zonaInput')!.valueChanges.pipe(startWith(''), map((v: any) => this._filter(v, this.zonasList)));
    this.filteredDroguerias = this.form.get('drogueriaInput')!.valueChanges.pipe(startWith(''), map((v: any) => this._filter(v, this.drogueriasList)));
  }

  displayFn(item: any): string { return item && item.nombre ? item.nombre : ''; }
  private _filter(val: any, list: { id: number; nombre: string }[]) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val?.nombre ? val.nombre.toLowerCase() : '');
    return list.filter(item => item.nombre.toLowerCase().includes(filterValue));
  }

  onPaisSelected(e: any) { this.form.patchValue({ paisId: e.option.value.id }); }
  onProvSelected(e: any) { this.form.patchValue({ provinciaId: e.option.value.id }); }
  onUbiSelected(e: any) { this.form.patchValue({ ubicacionId: e.option.value.id }); }
  onZonaSelected(e: any) { this.form.patchValue({ zonaId: e.option.value.id }); }
  onDrogSelected(e: any) { this.form.patchValue({ drogueriaId: e.option.value.id }); }

  onSave() {
    if (this.form.valid) {
      this.service.save(this.form.getRawValue() as any).subscribe(res => this.ref.close(res));
    }
  }
}
