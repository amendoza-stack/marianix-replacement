import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ObrasSocialesService } from '../services/obras-sociales.service';

@Component({
  selector: 'app-plan-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">assignment</mat-icon>
        {{ data.item ? 'Editar Plan de Cobertura' : 'Nuevo Plan de Cobertura' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código (Auto)</mat-label>
            <input matInput formControlName="codigo" readonly class="code-input">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-two-third">
            <mat-label>Descripción *</mat-label>
            <input matInput formControlName="descripcion" placeholder="Ej: PLAN 210">
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Descripción obligatoria</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Porcentaje Cobertura (%) *</mat-label>
            <input matInput type="number" formControlName="porcentajeCobertura" placeholder="0 - 100">
            <mat-error *ngIf="form.get('porcentajeCobertura')?.hasError('required')">Obligatorio</mat-error>
            <mat-error *ngIf="form.get('porcentajeCobertura')?.hasError('min')">Mínimo 0</mat-error>
            <mat-error *ngIf="form.get('porcentajeCobertura')?.hasError('max')">Máximo 100</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Copago Fijo ($) *</mat-label>
            <input matInput type="number" formControlName="copagoFijo" placeholder="0.00">
            <mat-error *ngIf="form.get('copagoFijo')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Código SSS</mat-label>
            <input matInput formControlName="codigoSSS" placeholder="SSS-210">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
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
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; }
    .dialog-content { padding: 8px 16px 16px 16px !important; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; }
    .col-full { width: 100%; }
    .col-third { width: calc(33.33% - 7px); }
    .col-two-third { width: calc(66.66% - 3px); }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; }
  `]
})
export class PlanFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<PlanFormDialogComponent>);
  private service = inject(ObrasSocialesService);
  public data: { obraSocialId: number; item?: any } = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    id: [null as number | null],
    codigo: [{ value: 'PLN-AUTO', disabled: true }],
    descripcion: ['', Validators.required],
    porcentajeCobertura: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    copagoFijo: [0, [Validators.required, Validators.min(0)]],
    codigoSSS: [''],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    if (this.data.item) {
      this.form.patchValue(this.data.item);
    }
  }

  onSave() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const payload = {
        ...(raw.id ? { id: raw.id } : {}),
        obraSocialId: this.data.obraSocialId,
        codigo: raw.codigo || 'PLN-AUTO',
        descripcion: raw.descripcion!.trim().toUpperCase(),
        porcentajeCobertura: Number(raw.porcentajeCobertura),
        copagoFijo: Number(raw.copagoFijo),
        codigoSSS: raw.codigoSSS ? raw.codigoSSS.trim().toUpperCase() : '',
        activo: raw.activo!
      };

      this.service.savePlan(payload).subscribe({
        next: (res) => this.ref.close(res),
        error: (err) => alert(err.message)
      });
    }
  }
}
