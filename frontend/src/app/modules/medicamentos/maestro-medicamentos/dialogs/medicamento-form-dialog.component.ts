import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrogasService, MonodrogasService, PotenciasService, ViasAdministracionService, AccionesTerapeurticasService, MedicamentosMasterService } from '../services/medicamentos.service';
import { MedicamentosValidators } from '../validators/medicamentos.validators';
import { PotenciaInterface, ViaAdministracionInterface, AccionTerapeurticaInterface } from '../models/medicamentos-master.model';

// 1. DIÁLOGO DROGAS
@Component({
  selector: 'app-droga-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">medication</mat-icon>
        {{ data ? 'Editar Droga' : 'Nueva Droga' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-vertical">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: ÁCIDO ACETILSALICÍLICO">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
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
    .dialog-content { padding: 8px 16px 16px 16px !important; overflow-x: hidden; }
    .form-vertical { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .full-width { width: 100%; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class DrogaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<DrogaFormDialogComponent>);
  private service = inject(DrogasService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [''],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    activo: [true, Validators.required]
  });

  ngOnInit() { if (this.data) this.form.patchValue(this.data); }
  onSave() { if (this.form.valid) this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res)); }
}

// 2. DIÁLOGO MONODROGAS
@Component({
  selector: 'app-monodroga-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">science</mat-icon>
        {{ data ? 'Editar Monodroga' : 'Nueva Monodroga' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-vertical">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código Sistema (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código SSS (Opcional)</mat-label>
            <input matInput formControlName="codigoSSS" placeholder="Ej: SSS-4920">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción / Principio Activo *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: ÁCIDO ACETILSALICÍLICO 500 MG">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
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
    .dialog-content { padding: 8px 16px 16px 16px !important; overflow-x: hidden; }
    .form-vertical { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .full-width { width: 100%; }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class MonodrogaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<MonodrogaFormDialogComponent>);
  private service = inject(MonodrogasService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [{ value: '', disabled: true }],
    codigoSSS: [''],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.codigo) this.form.get('codigo')?.setValue(this.data.codigo);
    } else {
      this.form.get('codigo')?.setValue('MON-004');
    }
  }

  onSave() {
    if (this.form.valid) {
      this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res));
    }
  }
}

// 3. DIÁLOGO POTENCIAS
@Component({
  selector: 'app-potencia-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">speed</mat-icon>
        {{ data ? 'Editar Potencia' : 'Nueva Potencia' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-vertical">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código Sistema (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: MILIGRAMOS">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Abreviatura *</mat-label>
            <input matInput formControlName="abreviatura" placeholder="Ej: MG, MCG, ML">
            <mat-error *ngIf="form.get('abreviatura')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
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
    .dialog-content { padding: 8px 16px 16px 16px !important; overflow-x: hidden; }
    .form-vertical { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .full-width { width: 100%; }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class PotenciaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<PotenciaFormDialogComponent>);
  private service = inject(PotenciasService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [{ value: '', disabled: true }],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    abreviatura: ['', Validators.required],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.codigo) this.form.get('codigo')?.setValue(this.data.codigo);
    } else {
      this.form.get('codigo')?.setValue('POT-007');
    }
  }

  onSave() {
    if (this.form.valid) {
      this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res), (err: any) => alert(err.message));
    }
  }
}

// 4. DIÁLOGO VÍAS DE ADMINISTRACIÓN
@Component({
  selector: 'app-via-administracion-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">route</mat-icon>
        {{ data ? 'Editar Vía de Administración' : 'Nueva Vía de Administración' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-vertical">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código (No Modificable)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: ORAL, INTRAVENOSA">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
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
    .dialog-content { padding: 8px 16px 16px 16px !important; overflow-x: hidden; }
    .form-vertical { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .full-width { width: 100%; }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class ViaAdministracionFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<ViaAdministracionFormDialogComponent>);
  private service = inject(ViasAdministracionService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [{ value: '', disabled: true }],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.codigo) this.form.get('codigo')?.setValue(this.data.codigo);
    } else {
      this.form.get('codigo')?.setValue('VIA-013');
    }
  }

  onSave() {
    if (this.form.valid) {
      this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res), (err: any) => alert(err.message));
    }
  }
}

// 5. DIÁLOGO ACCIONES TERAPÉUTICAS (NUEVO ABM FASE 6)
@Component({
  selector: 'app-accion-terapeutica-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">health_and_safety</mat-icon>
        {{ data ? 'Editar Acción Terapéutica' : 'Nueva Acción Terapéutica' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-vertical">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código Sistema (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción / Acción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: ANALGÉSICO, ANTIBIÓTICO">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
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
    .dialog-content { padding: 8px 16px 16px 16px !important; overflow-x: hidden; }
    .form-vertical { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .full-width { width: 100%; }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class AccionTerapeurticaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<AccionTerapeurticaFormDialogComponent>);
  private service = inject(AccionesTerapeurticasService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [{ value: '', disabled: true }],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.codigo) this.form.get('codigo')?.setValue(this.data.codigo);
    } else {
      this.form.get('codigo')?.setValue('ACT-011');
    }
  }

  onSave() {
    if (this.form.valid) {
      this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res), (err: any) => alert(err.message));
    }
  }
}

// 6. DIÁLOGO MEDICAMENTO CON INTEGRACIÓN DE ACCIONES TERAPÉUTICAS
@Component({
  selector: 'app-medicamento-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule,
    MatNativeDateModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">local_pharmacy</mat-icon>
        {{ data ? 'Editar Medicamento' : 'Nuevo Medicamento' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <!-- DESCRIPCIÓN COMERCIAL -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Descripción Comercial *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: ASPIRINNET 500 MG x 30 COMP.">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE LABORATORIO -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Laboratorio *</mat-label>
            <input type="text" matInput formControlName="laboratorioInput" [matAutocomplete]="autoLab" placeholder="Buscar laboratorio...">
            <mat-autocomplete #autoLab="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onLabSelected($event)">
              <mat-option *ngFor="let option of filteredLaboratorios | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('laboratorioId')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE MONODROGA -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Monodroga *</mat-label>
            <input type="text" matInput formControlName="monodrogaInput" [matAutocomplete]="autoMono" placeholder="Buscar monodroga...">
            <mat-autocomplete #autoMono="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onMonoSelected($event)">
              <mat-option *ngFor="let option of filteredMonodrogas | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('monodrogaId')?.hasError('required')">Campo obligatorio</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE POTENCIA -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Potencia *</mat-label>
            <input type="text" matInput formControlName="potenciaInput" [matAutocomplete]="autoPot" placeholder="Ej: MG, ML...">
            <mat-autocomplete #autoPot="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onPotenciaSelected($event)">
              <mat-option *ngFor="let option of filteredPotencias | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <!-- AUTOCOMPLETE VÍA DE ADMINISTRACIÓN -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Vía Administración *</mat-label>
            <input type="text" matInput formControlName="viaInput" [matAutocomplete]="autoVia" placeholder="Ej: ORAL...">
            <mat-autocomplete #autoVia="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onViaSelected($event)">
              <mat-option *ngFor="let option of filteredVias | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <!-- AUTOCOMPLETE ACCIÓN TERAPÉUTICA -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Acción Terapéutica *</mat-label>
            <input type="text" matInput formControlName="accionInput" [matAutocomplete]="autoAccion" placeholder="Ej: ANALGÉSICO...">
            <mat-autocomplete #autoAccion="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onAccionSelected($event)">
              <mat-option *ngFor="let option of filteredAcciones | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <!-- AUTOCOMPLETE FORMA FARMACÉUTICA -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Forma Farmacéutica *</mat-label>
            <input type="text" matInput formControlName="formaFarmaceuticaInput" [matAutocomplete]="autoForma" placeholder="Ej: COMPRIMIDO...">
            <mat-autocomplete #autoForma="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onFormaSelected($event)">
              <mat-option *ngFor="let option of filteredFormas | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <!-- TAMAÑO -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Tamaño / Presentación</mat-label>
            <input matInput formControlName="tamano" placeholder="30 COMPRIMIDOS">
          </mat-form-field>

          <!-- CÓDIGO BARRAS Y TRAZABILIDAD -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Código de Barras</mat-label>
            <input matInput formControlName="codigoBarras" placeholder="7791234567890">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Código Trazabilidad</mat-label>
            <input matInput formControlName="codigoTrazabilidad" placeholder="TRZ-9402918">
          </mat-form-field>

          <!-- PRECIOS -->
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Precio Alfa ($)</mat-label>
            <input matInput type="number" formControlName="precioAlfa" placeholder="0.00">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Precio Venta ($)</mat-label>
            <input matInput type="number" formControlName="precioVenta" placeholder="0.00">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Precio Público ($)</mat-label>
            <input matInput type="number" formControlName="precioPublico" placeholder="0.00">
          </mat-form-field>

          <!-- VIGENCIA Y MULTIDROGA -->
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Vigencia Fecha *</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="vigenciaFecha">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Multidroga</mat-label>
            <mat-select formControlName="multidroga">
              <mat-option value="No">No</mat-option>
              <mat-option value="Sí">Sí</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- OBSERVACIONES Y ESTADO -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="2" placeholder="Observaciones adicionales..."></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Estado *</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="Activo">Activo</mat-option>
              <mat-option value="Inactivo">Inactivo</mat-option>
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
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class MedicamentoFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<MedicamentoFormDialogComponent>);
  private service = inject(MedicamentosMasterService);
  private potenciasService = inject(PotenciasService);
  private viasService = inject(ViasAdministracionService);
  private accionesService = inject(AccionesTerapeurticasService);
  private monodrogasService = inject(MonodrogasService);
  public data: any = inject(MAT_DIALOG_DATA);

  // LISTAS DE AUTOCOMPLETE
  labList = [
    { id: 1, nombre: 'LABORATORIOS BAGO S.A.' },
    { id: 2, nombre: 'ROEMMERS S.A.I.C.F.' },
    { id: 3, nombre: 'ELEA PHOENIX S.A.' }
  ];

  monoList: { id: number; nombre: string }[] = [];
  potList: { id: number; nombre: string }[] = [];
  viaList: { id: number; nombre: string }[] = [];
  accionList: { id: number; nombre: string }[] = [];
  formaList = [
    { id: 1, nombre: 'COMPRIMIDO' },
    { id: 2, nombre: 'CÁPSULA BLANDA' },
    { id: 3, nombre: 'JARABE' },
    { id: 4, nombre: 'INYECTABLE' },
    { id: 5, nombre: 'CREMA / POMADA' }
  ];

  filteredLaboratorios!: Observable<{ id: number; nombre: string }[]>;
  filteredMonodrogas!: Observable<{ id: number; nombre: string }[]>;
  filteredPotencias!: Observable<{ id: number; nombre: string }[]>;
  filteredVias!: Observable<{ id: number; nombre: string }[]>;
  filteredAcciones!: Observable<{ id: number; nombre: string }[]>;
  filteredFormas!: Observable<{ id: number; nombre: string }[]>;

  form = this.fb.group({
    id: [null],
    codigo: [''],
    descripcion: ['', Validators.required],
    laboratorioId: [1, Validators.required],
    laboratorioInput: [{ id: 1, nombre: 'LABORATORIOS BAGO S.A.' }],
    monodrogaId: [1, Validators.required],
    monodrogaInput: [{ id: 1, nombre: 'ÁCIDO ACETILSALICÍLICO 500 MG' }],
    potenciaId: [1],
    potenciaInput: [{ id: 1, nombre: 'MILIGRAMOS (MG)' }],
    viaAdministracionId: [1],
    viaInput: [{ id: 1, nombre: 'ORAL' }],
    accionTerapeurticaId: [1],
    accionInput: [{ id: 1, nombre: 'ANALGÉSICO' }],
    formaFarmaceuticaId: [1],
    formaFarmaceuticaInput: [{ id: 1, nombre: 'COMPRIMIDO' }],
    tamano: ['30 COMPRIMIDOS'],
    codigoBarras: [''],
    codigoTrazabilidad: [''],
    precioAlfa: [0],
    precioVenta: [0],
    precioPublico: [0],
    vigenciaFecha: [new Date(), Validators.required],
    multidroga: ['No'],
    observaciones: [''],
    estado: ['Activo', Validators.required]
  });

  ngOnInit() {
    this.monodrogasService.getAll().subscribe(res => {
      this.monoList = res.map(x => ({ id: x.id, nombre: x.descripcion }));
      this.initFilters();
    });

    this.potenciasService.getAll().subscribe(res => {
      this.potList = res.map(x => ({ id: x.id, nombre: `${x.descripcion} (${x.abreviatura})` }));
      this.initFilters();
    });

    this.viasService.getAll().subscribe(res => {
      this.viaList = res.map(x => ({ id: x.id, nombre: x.descripcion }));
      this.initFilters();
    });

    this.accionesService.getAll().subscribe(res => {
      this.accionList = res.map(x => ({ id: x.id, nombre: x.descripcion }));
      this.initFilters();
    });

    this.initFilters();

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  initFilters() {
    this.filteredLaboratorios = this.form.get('laboratorioInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.labList))
    );

    this.filteredMonodrogas = this.form.get('monodrogaInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.monoList))
    );

    this.filteredPotencias = this.form.get('potenciaInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.potList))
    );

    this.filteredVias = this.form.get('viaInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.viaList))
    );

    this.filteredAcciones = this.form.get('accionInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.accionList))
    );

    this.filteredFormas = this.form.get('formaFarmaceuticaInput')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val, this.formaList))
    );
  }

  displayFn(item: any): string {
    return item && item.nombre ? item.nombre : '';
  }

  private _filter(val: any, list: { id: number; nombre: string }[]) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val?.nombre ? val.nombre.toLowerCase() : '');
    return list.filter(item => item.nombre.toLowerCase().includes(filterValue));
  }

  onLabSelected(event: any) { this.form.patchValue({ laboratorioId: event.option.value.id }); }
  onMonoSelected(event: any) { this.form.patchValue({ monodrogaId: event.option.value.id }); }
  onPotenciaSelected(event: any) { this.form.patchValue({ potenciaId: event.option.value.id }); }
  onViaSelected(event: any) { this.form.patchValue({ viaAdministracionId: event.option.value.id }); }
  onAccionSelected(event: any) { this.form.patchValue({ accionTerapeurticaId: event.option.value.id }); }
  onFormaSelected(event: any) { this.form.patchValue({ formaFarmaceuticaId: event.option.value.id }); }

  onSave() {
    if (this.form.valid) {
      const val = this.form.getRawValue();
      this.service.save(val as any).subscribe((res: any) => this.ref.close(res));
    }
  }
}
