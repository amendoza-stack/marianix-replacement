import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MedicosService } from '../services/medicos.service';
import { GestionMedicaValidators } from '../../afiliados/validators/gestion-medica.validators';

@Component({
  selector: 'app-medico-form-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-wrapper notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">{{ isEdit() ? 'edit' : 'health_and_safety' }}</mat-icon>
        {{ isEdit() ? 'Editar Médico' : 'Nuevo Médico' }}
      </h2>

      <mat-dialog-content class="modal-content">
        <form [formGroup]="form" class="form-grid">
          
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Apellido *</mat-label>
            <input matInput formControlName="apellido" placeholder="MARTÍNEZ">
            <mat-error *ngIf="form.get('apellido')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Nombre *</mat-label>
            <input matInput formControlName="nombre" placeholder="CARLOS">
            <mat-error *ngIf="form.get('nombre')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Matrícula *</mat-label>
            <input matInput formControlName="matricula" placeholder="MP-84930">
            <mat-error *ngIf="form.get('matricula')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Tipo Matrícula</mat-label>
            <mat-select formControlName="tipoMatricula">
              <mat-option value="Provincial">Provincial</mat-option>
              <mat-option value="Nacional">Nacional</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="Activo">Activo</mat-option>
              <mat-option value="Inactivo">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Especialidad Médica *</mat-label>
            <mat-select formControlName="especialidadId" (selectionChange)="onEspecialidadChange($event.value)">
              <mat-option [value]="1">CLÍNICA MÉDICA</mat-option>
              <mat-option [value]="2">PEDIATRÍA Y PUERICULTURA</mat-option>
              <mat-option [value]="3">CARDIOLOGÍA INTERVENCIONISTA</mat-option>
              <mat-option [value]="4">GINECOLOGÍA Y OBSTETRICIA</mat-option>
              <mat-option [value]="5">TRAUMATOLOGÍA Y ORTOPEDIA</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('especialidadId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>CUIT</mat-label>
            <input matInput formControlName="cuit" placeholder="20149302918">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="telefono" placeholder="011-4930-2910">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Correo Electrónico (Mail)</mat-label>
            <input matInput formControlName="mail" placeholder="cmartinez@medicos.org">
            <mat-error *ngIf="form.get('mail')?.hasError('emailInvalido')">Email inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="2"></textarea>
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close [disabled]="isLoading()">Cancelar</button>
        <button mat-flat-button color="primary" class="btn-submit" [disabled]="form.invalid || isLoading()" (click)="onSave()">
          <mat-spinner *ngIf="isLoading()" diameter="20" class="spinner-inline"></mat-spinner>
          <span *ngIf="!isLoading()">Guardar Médico</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper { width: 640px; max-width: 95vw; box-sizing: border-box; }
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--text-main); margin: 0; }
    .modal-content { max-height: 75vh; overflow-y: auto; padding-top: 12px !important; }
    .form-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .col-full { width: 100%; }
    .col-half { width: calc(50% - 5px); }
    .col-third { width: calc(33.33% - 7px); }
    .dialog-actions { padding: 16px 24px !important; border-top: 1px solid var(--border-color); }
    .btn-submit { height: 42px; font-weight: 700; padding: 0 24px; background-color: var(--brand-primary) !important; }
    .spinner-inline { display: inline-block; }
  `]
})
export class MedicoFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MedicoFormDialogComponent>);
  private service = inject(MedicosService);
  public data: any = inject(MAT_DIALOG_DATA);

  isEdit = signal<boolean>(!!this.data);
  isLoading = signal<boolean>(false);

  espeMap: { [key: number]: string } = {
    1: 'CLÍNICA MÉDICA', 2: 'PEDIATRÍA Y PUERICULTURA',
    3: 'CARDIOLOGÍA INTERVENCIONISTA', 4: 'GINECOLOGÍA Y OBSTETRICIA', 5: 'TRAUMATOLOGÍA Y ORTOPEDIA'
  };

  form: FormGroup = this.fb.group({
    id: [null],
    codigo: [''],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    matricula: ['', [Validators.required, GestionMedicaValidators.matricula()]],
    especialidadId: [1, Validators.required],
    especialidadNombre: ['CLÍNICA MÉDICA'],
    tipoMatricula: ['Provincial'],
    estado: ['Activo', Validators.required],
    cuit: [''],
    telefono: [''],
    mail: ['', [GestionMedicaValidators.email()]],
    observaciones: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  onEspecialidadChange(id: number): void {
    this.form.patchValue({ especialidadNombre: this.espeMap[id] || '' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    this.service.save(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.message || 'Error al guardar médico');
      }
    });
  }
}
