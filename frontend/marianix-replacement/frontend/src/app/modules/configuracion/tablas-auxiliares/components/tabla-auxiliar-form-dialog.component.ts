import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablasAuxiliaresValidators } from '../validators/tablas-auxiliares.validators';
import { TablasAuxiliaresService } from '../services/tablas-auxiliares.service';
import { PaisItem } from '../models/tablas-auxiliares.model';

@Component({
  selector: 'app-tabla-auxiliar-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-container notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">{{ isEdit() ? 'edit' : 'add_circle' }}</mat-icon>
        {{ titleText() }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <!-- CÓDIGO -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Código *</mat-label>
            <input matInput formControlName="codigo" placeholder="Ej: ARG" [readonly]="isCodeReadOnly()">
            <mat-error *ngIf="form.get('codigo')?.hasError('required')">El código es obligatorio</mat-error>
            <mat-error *ngIf="form.get('codigo')?.hasError('codigoMaxLength')">Máximo {{ maxCodigoLen() }} caracteres</mat-error>
          </mat-form-field>

          <!-- PAÍS (SOLO PARA PROVINCIAS) -->
          <mat-form-field *ngIf="entityKey === 'provincias'" appearance="outline" class="col-full">
            <mat-label>País Asociado *</mat-label>
            <mat-select formControlName="paisId">
              <mat-option *ngFor="let p of paises()" [value]="p.id">{{ p.descripcion }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('paisId')?.hasError('required')">El país es obligatorio</mat-error>
          </mat-form-field>

          <!-- DESCRIPCIÓN -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Descripción *</mat-label>
            <textarea *ngIf="entityKey === 'observaciones'; else standardInput" matInput formControlName="descripcion" rows="3" maxlength="500"></textarea>
            <ng-template #standardInput>
              <input matInput formControlName="descripcion" placeholder="Ej: ARGENTINA" maxlength="100">
            </ng-template>
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">La descripción es obligatoria</mat-error>
          </mat-form-field>

          <!-- FECHAS (SOLO PARA PERÍODOS) -->
          <ng-container *ngIf="entityKey === 'periodos'">
            <mat-form-field appearance="outline" class="col-half">
              <mat-label>Fecha Desde *</mat-label>
              <input matInput [matDatepicker]="pickerDesde" formControlName="fechaDesde">
              <mat-datepicker-toggle matIconSuffix [for]="pickerDesde"></mat-datepicker-toggle>
              <mat-datepicker #pickerDesde></mat-datepicker>
              <mat-error *ngIf="form.get('fechaDesde')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="col-half">
              <mat-label>Fecha Hasta *</mat-label>
              <input matInput [matDatepicker]="pickerHasta" formControlName="fechaHasta">
              <mat-datepicker-toggle matIconSuffix [for]="pickerHasta"></mat-datepicker-toggle>
              <mat-datepicker #pickerHasta></mat-datepicker>
              <mat-error *ngIf="form.get('fechaHasta')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>
            
            <div *ngIf="form.hasError('fechaRangoInvalido')" class="col-full error-range">
              La fecha hasta debe ser mayor a la fecha desde.
            </div>
          </ng-container>

          <!-- ESTADO ACTIVO -->
          <div class="col-full margin-top-8">
            <mat-slide-toggle formControlName="activo" color="primary">Registro Activo</mat-slide-toggle>
          </div>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close [disabled]="isLoading()">Cancelar</button>
        <button mat-flat-button color="primary" class="btn-submit" [disabled]="form.invalid || isLoading()" (click)="onSave()">
          <mat-spinner *ngIf="isLoading()" diameter="20" class="spinner-inline"></mat-spinner>
          <span *ngIf="!isLoading()">Guardar</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { width: 460px; max-width: 95vw; box-sizing: border-box; }
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--text-main); margin: 0; }
    .dialog-content { padding-top: 12px !important; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .col-full { width: 100%; }
    .col-half { width: calc(50% - 5px); }
    .margin-top-8 { margin-top: 8px; }
    .error-range { color: #EF4444; font-size: 0.78rem; font-weight: 700; margin-top: -6px; }
    .dialog-actions { padding: 16px 24px !important; border-top: 1px solid var(--border-color); }
    .btn-submit { height: 42px; font-weight: 700; padding: 0 24px; background-color: var(--brand-primary) !important; }
    .spinner-inline { display: inline-block; }
  `]
})
export class TablaAuxiliarFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TablaAuxiliarFormDialogComponent>);
  private apiService = inject(TablasAuxiliaresService);
  public data: any = inject(MAT_DIALOG_DATA);

  entityKey: string = this.data.entityKey;
  entityTitle: string = this.data.entityTitle;
  
  isEdit = signal<boolean>(!!this.data.item);
  isLoading = signal<boolean>(false);
  titleText = signal<string>(`${this.isEdit() ? 'Editar' : 'Nuevo'} ${this.entityTitle}`);
  maxCodigoLen = signal<number>(this.entityKey === 'paises' ? 5 : 10);
  paises = signal<PaisItem[]>([]);

  form: FormGroup = this.fb.group({
    id: [null],
    codigo: ['', [Validators.required, TablasAuxiliaresValidators.codigoMaxLength(this.maxCodigoLen())]],
    descripcion: ['', [Validators.required, TablasAuxiliaresValidators.descripcionTrimUppercase]],
    activo: [true]
  });

  ngOnInit(): void {
    if (this.entityKey === 'provincias') {
      this.form.addControl('paisId', this.fb.control(null, Validators.required));
      this.apiService.getAll<PaisItem>('paises').subscribe(res => this.paises.set(res));
    }

    if (this.entityKey === 'periodos') {
      this.form.addControl('fechaDesde', this.fb.control(null, Validators.required));
      this.form.addControl('fechaHasta', this.fb.control(null, Validators.required));
      this.form.addValidators(TablasAuxiliaresValidators.fechaRangoValido);
    }

    if (this.data.item) {
      this.form.patchValue(this.data.item);
    }
  }

  isCodeReadOnly(): boolean {
    if (this.entityKey === 'categorias' && this.isEdit()) return true;
    return false;
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    const val = this.form.getRawValue();
    if (val.descripcion) {
      val.descripcion = String(val.descripcion).trim().toUpperCase();
    }

    this.apiService.save(this.entityKey, val).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.message || 'Error al guardar');
      }
    });
  }
}
