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
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">local_pharmacy</mat-icon>
        {{ data ? 'Editar Medicamento' : 'Nuevo Medicamento' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Descripción Comercial *</mat-label>
            <input matInput formControlName="descripcion" placeholder="ASPIRINNET 500 MG x 30 COMP.">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Laboratorio *</mat-label>
            <mat-select formControlName="laboratorioId">
              <mat-option [value]="1">LABORATORIOS BAGO S.A.</mat-option>
              <mat-option [value]="2">ROEMMERS S.A.I.C.F.</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Monodroga *</mat-label>
            <mat-select formControlName="monodrogaId">
              <mat-option [value]="1">ÁCIDO ACETILSALICÍLICO 500 MG</mat-option>
              <mat-option [value]="2">IBUPROFENO 400 MG</mat-option>
              <mat-option [value]="3">LOSARTÁN POTÁSICO 50 MG</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Potencia *</mat-label>
            <mat-select formControlName="potenciaId">
              <mat-option *ngFor="let p of potenciasList" [value]="p.id">{{ p.descripcion }} ({{ p.abreviatura }})</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Vía de Administración *</mat-label>
            <mat-select formControlName="viaAdministracionId">
              <mat-option *ngFor="let v of viasList" [value]="v.id">{{ v.descripcion }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Acción Terapéutica *</mat-label>
            <mat-select formControlName="accionTerapeurticaId">
              <mat-option *ngFor="let a of accionesList" [value]="a.id">{{ a.descripcion }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Tamaño</mat-label>
            <input matInput formControlName="tamano" placeholder="30 COMPRIMIDOS">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código de Barras</mat-label>
            <input matInput formControlName="codigoBarras" placeholder="7791234567890">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Vigencia Fecha *</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="vigenciaFecha">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Forma Farmacéutica</mat-label>
            <input matInput formControlName="formaFarmaceutica" placeholder="COMPRIMIDO">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Multidroga</mat-label>
            <mat-select formControlName="multidroga">
              <mat-option value="No">No</mat-option>
              <mat-option value="Sí">Sí</mat-option>
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
    .dialog-content { padding: 8px 16px 16px 16px !important; max-height: 75vh; overflow-x: hidden; }
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
  public data: any = inject(MAT_DIALOG_DATA);

  potenciasList: PotenciaInterface[] = [];
  viasList: ViaAdministracionInterface[] = [];
  accionesList: AccionTerapeurticaInterface[] = [];

  form = this.fb.group({
    id: [null],
    codigo: [''],
    descripcion: ['', Validators.required],
    tamano: [''],
    laboratorioId: [1, Validators.required],
    codOrigenPrecio: ['FAB'],
    codIva: ['21%'],
    vigenciaFecha: [new Date(), Validators.required],
    codigoBarras: [''],
    monodrogaId: [1, Validators.required],
    potenciaId: [1, Validators.required],
    potencia: ['500 MG'],
    viaAdministracionId: [1, Validators.required],
    viaAdministracion: ['ORAL'],
    accionTerapeurticaId: [1, Validators.required],
    accion: ['ANALGÉSICO'],
    formaFarmaceutica: ['COMPRIMIDO'],
    contenido: ['30 UNIDADES'],
    multidroga: ['No'],
    estado: ['Activo']
  });

  ngOnInit() {
    this.potenciasService.getAll().subscribe((res: PotenciaInterface[]) => this.potenciasList = res);
    this.viasService.getAll().subscribe((res: ViaAdministracionInterface[]) => this.viasList = res);
    this.accionesService.getAll().subscribe((res: AccionTerapeurticaInterface[]) => this.accionesList = res);
    if (this.data) this.form.patchValue(this.data);
  }

  onSave() { if (this.form.valid) this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res)); }
}
