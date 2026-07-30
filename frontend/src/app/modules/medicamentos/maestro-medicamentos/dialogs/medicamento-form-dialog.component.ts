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
import { DrogasService, MonodrogasService, MedicamentosMasterService } from '../services/medicamentos.service';
import { MedicamentosValidators } from '../validators/medicamentos.validators';

@Component({
  selector: 'app-droga-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="font-weight:800"><mat-icon color="primary">medication</mat-icon> {{ data ? 'Editar Droga' : 'Nueva Droga' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex; flex-direction:column; gap:12px; padding-top:8px; width:400px">
        <mat-form-field appearance="outline">
          <mat-label>Descripción *</mat-label>
          <input matInput formControlName="descripcion" placeholder="ÁCIDO ACETILSALICÍLICO">
          <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Obligatorio</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estado *</mat-label>
          <mat-select formControlName="activo">
            <mat-option [value]="true">Activo</mat-option>
            <mat-option [value]="false">Inactivo</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
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

@Component({
  selector: 'app-monodroga-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="font-weight:800"><mat-icon color="primary">science</mat-icon> {{ data ? 'Editar Monodroga' : 'Nueva Monodroga' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex; flex-direction:column; gap:12px; padding-top:8px; width:420px">
        <mat-form-field appearance="outline">
          <mat-label>Código SSS *</mat-label>
          <input matInput formControlName="codigoSSS" placeholder="SSS-4920">
          <mat-error *ngIf="form.get('codigoSSS')?.hasError('required')">Obligatorio</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Descripción *</mat-label>
          <input matInput formControlName="descripcion" placeholder="ÁCIDO ACETILSALICÍLICO 500 MG">
          <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Obligatorio</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estado *</mat-label>
          <mat-select formControlName="activo">
            <mat-option [value]="true">Activo</mat-option>
            <mat-option [value]="false">Inactivo</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class MonodrogaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<MonodrogaFormDialogComponent>);
  private service = inject(MonodrogasService);
  public data: any = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null],
    codigo: [''],
    codigoSSS: ['', [Validators.required, MedicamentosValidators.codigoSSS()]],
    descripcion: ['', [Validators.required, MedicamentosValidators.descripcionUppercase()]],
    activo: [true, Validators.required]
  });

  ngOnInit() { if (this.data) this.form.patchValue(this.data); }
  onSave() { if (this.form.valid) this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res)); }
}

@Component({
  selector: 'app-medicamento-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="font-weight:800"><mat-icon color="primary">local_pharmacy</mat-icon> {{ data ? 'Editar Medicamento' : 'Nuevo Medicamento' }}</h2>
    <mat-dialog-content style="max-height: 75vh">
      <form [formGroup]="form" style="display:flex; flex-wrap:wrap; gap:12px; padding-top:8px; width:650px">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Descripción Comercial *</mat-label>
          <input matInput formControlName="descripcion" placeholder="ASPIRINNET 500 MG x 30 COMP.">
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(50% - 6px)">
          <mat-label>Laboratorio *</mat-label>
          <mat-select formControlName="laboratorioId">
            <mat-option [value]="1">LABORATORIOS BAGO S.A.</mat-option>
            <mat-option [value]="2">ROEMMERS S.A.I.C.F.</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(50% - 6px)">
          <mat-label>Monodroga *</mat-label>
          <mat-select formControlName="monodrogaId">
            <mat-option [value]="1">ÁCIDO ACETILSALICÍLICO 500 MG</mat-option>
            <mat-option [value]="2">IBUPROFENO 400 MG</mat-option>
            <mat-option [value]="3">LOSARTÁN POTÁSICO 50 MG</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(33% - 6px)">
          <mat-label>Tamaño</mat-label>
          <input matInput formControlName="tamano" placeholder="30 COMPRIMIDOS">
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(33% - 6px)">
          <mat-label>Código de Barras</mat-label>
          <input matInput formControlName="codigoBarras" placeholder="7791234567890">
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(33% - 6px)">
          <mat-label>Vigencia Fecha *</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="vigenciaFecha">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(50% - 6px)">
          <mat-label>Forma Farmacéutica</mat-label>
          <input matInput formControlName="formaFarmaceutica" placeholder="COMPRIMIDO">
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:calc(50% - 6px)">
          <mat-label>Multidroga</mat-label>
          <mat-select formControlName="multidroga">
            <mat-option value="No">No</mat-option>
            <mat-option value="Sí">Sí</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class MedicamentoFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<MedicamentoFormDialogComponent>);
  private service = inject(MedicamentosMasterService);
  public data: any = inject(MAT_DIALOG_DATA);

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
    potencia: ['500 MG'],
    formaFarmaceutica: ['COMPRIMIDO'],
    viaAdministracion: ['ORAL'],
    contenido: ['30 UNIDADES'],
    accion: ['TERAPÉUTICA'],
    multidroga: ['No'],
    estado: ['Activo']
  });

  ngOnInit() { if (this.data) this.form.patchValue(this.data); }
  onSave() { if (this.form.valid) this.service.save(this.form.getRawValue() as any).subscribe((res: any) => this.ref.close(res)); }
}
