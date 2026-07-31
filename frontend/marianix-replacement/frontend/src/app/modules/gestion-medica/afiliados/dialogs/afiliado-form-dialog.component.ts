import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AfiliadoInterface, AfiliadoMapper } from '../models/afiliado.model';
import { AfiliadosService } from '../services/afiliados.service';
import { GestionMedicaValidators } from '../validators/gestion-medica.validators';

@Component({
  selector: 'app-afiliado-form-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-wrapper notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">{{ isEdit() ? 'edit' : 'person_add' }}</mat-icon>
        {{ isEdit() ? 'Editar Afiliado' : 'Nuevo Afiliado' }}
      </h2>

      <mat-dialog-content class="modal-content">
        <form [formGroup]="form" class="form-grid">
          
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Apellido *</mat-label>
            <input matInput formControlName="apellido" placeholder="PÉREZ">
            <mat-error *ngIf="form.get('apellido')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Nombre *</mat-label>
            <input matInput formControlName="nombre" placeholder="JUAN CARLOS">
            <mat-error *ngIf="form.get('nombre')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>DNI *</mat-label>
            <input matInput formControlName="dni" placeholder="28493021">
            <mat-error *ngIf="form.get('dni')?.hasError('required')">Obligatorio</mat-error>
            <mat-error *ngIf="form.get('dni')?.hasError('dniInvalido')">DNI Inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>CUIL *</mat-label>
            <input matInput formControlName="cuil" placeholder="20284930218">
            <mat-error *ngIf="form.get('cuil')?.hasError('required')">Obligatorio</mat-error>
            <mat-error *ngIf="form.get('cuil')?.hasError('cuilInvalido')">CUIL (11 dígitos)</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Estado *</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="Activo">Activo</mat-option>
              <mat-option value="Inactivo">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Obra Social *</mat-label>
            <mat-select formControlName="obraSocialId" (selectionChange)="onObraSocialChange($event.value)">
              <mat-option [value]="1">PAMI INSSJP</mat-option>
              <mat-option [value]="2">IOMA</mat-option>
              <mat-option [value]="3">OSDE</mat-option>
              <mat-option [value]="4">SWISS MEDICAL</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('obraSocialId')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Número Afiliado *</mat-label>
            <input matInput formControlName="numeroAfiliado" placeholder="15029384901">
            <mat-error *ngIf="form.get('numeroAfiliado')?.hasError('required')">Obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Vínculo *</mat-label>
            <mat-select formControlName="vinculoId" (selectionChange)="onVinculoChange($event.value)">
              <mat-option [value]="1">TITULAR</mat-option>
              <mat-option [value]="2">CÓNYUGE</mat-option>
              <mat-option [value]="3">HIJO</mat-option>
              <mat-option [value]="4">MADRE</mat-option>
              <mat-option [value]="5">PADRE</mat-option>
              <mat-option [value]="6">OTRO</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Sexo</mat-label>
            <mat-select formControlName="sexo">
              <mat-option value="Masculino">Masculino</mat-option>
              <mat-option value="Femenino">Femenino</mat-option>
              <mat-option value="Otro">Otro</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-third">
            <mat-label>Tipo Beneficiario</mat-label>
            <mat-select formControlName="tipoBeneficiario">
              <mat-option value="Titular">Titular</mat-option>
              <mat-option value="Cónyuge">Cónyuge</mat-option>
              <mat-option value="Hijo">Hijo</mat-option>
              <mat-option value="Padre">Padre</mat-option>
              <mat-option value="Madre">Madre</mat-option>
              <mat-option value="Otro">Otro</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Fecha Nacimiento</mat-label>
            <input matInput [matDatepicker]="pickerNac" formControlName="fechaNacimiento" (dateChange)="onFechaNacChange($event.value)">
            <mat-datepicker-toggle matIconSuffix [for]="pickerNac"></mat-datepicker-toggle>
            <mat-datepicker #pickerNac></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Edad (Calculada Automáticamente)</mat-label>
            <input matInput [value]="calculatedAge()" readonly style="font-weight: 800; color: #0284C7; background: #F0F9FF;">
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Observaciones (hasta 500 caracteres)</mat-label>
            <textarea matInput formControlName="observaciones" rows="2" maxlength="500"></textarea>
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close [disabled]="isLoading()">Cancelar</button>
        <button mat-flat-button color="primary" class="btn-submit" [disabled]="form.invalid || isLoading()" (click)="onSave()">
          <mat-spinner *ngIf="isLoading()" diameter="20" class="spinner-inline"></mat-spinner>
          <span *ngIf="!isLoading()">Guardar Afiliado</span>
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper { width: 680px; max-width: 95vw; box-sizing: border-box; }
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
export class AfiliadoFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AfiliadoFormDialogComponent>);
  private service = inject(AfiliadosService);
  public data: any = inject(MAT_DIALOG_DATA);

  isEdit = signal<boolean>(!!this.data);
  isLoading = signal<boolean>(false);
  calculatedAge = signal<number>(0);

  obraSocialesMap: { [key: number]: string } = { 1: 'PAMI INSSJP', 2: 'IOMA', 3: 'OSDE', 4: 'SWISS MEDICAL' };
  vinculosMap: { [key: number]: string } = { 1: 'TITULAR', 2: 'CÓNYUGE', 3: 'HIJO', 4: 'MADRE', 5: 'PADRE', 6: 'OTRO' };

  form: FormGroup = this.fb.group({
    id: [null],
    codigo: [''],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    dni: ['', [Validators.required, GestionMedicaValidators.dni()]],
    cuil: ['', [Validators.required, GestionMedicaValidators.cuil()]],
    estado: ['Activo', Validators.required],
    obraSocialId: [1, Validators.required],
    obraSocialNombre: ['PAMI INSSJP'],
    numeroAfiliado: ['', Validators.required],
    vinculoId: [1, Validators.required],
    vinculoNombre: ['TITULAR'],
    sexo: ['Masculino'],
    tipoBeneficiario: ['Titular'],
    fechaNacimiento: ['1990-01-01'],
    observaciones: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.fechaNacimiento) {
        this.calculatedAge.set(AfiliadoMapper.calcularEdad(this.data.fechaNacimiento));
      }
    }
  }

  onFechaNacChange(val: any): void {
    if (val) {
      const dStr = new Date(val).toISOString().split('T')[0];
      this.calculatedAge.set(AfiliadoMapper.calcularEdad(dStr));
    }
  }

  onObraSocialChange(id: number): void {
    this.form.patchValue({ obraSocialNombre: this.obraSocialesMap[id] || '' });
  }

  onVinculoChange(id: number): void {
    this.form.patchValue({ vinculoNombre: this.vinculosMap[id] || '' });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    const val = this.form.getRawValue();
    if (val.fechaNacimiento instanceof Date) {
      val.fechaNacimiento = val.fechaNacimiento.toISOString().split('T')[0];
    }

    this.service.save(val).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.message || 'Error al guardar afiliado');
      }
    });
  }
}
