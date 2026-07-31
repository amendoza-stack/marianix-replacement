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
import { ObrasSocialesService } from '../services/obras-sociales.service';

@Component({
  selector: 'app-plan-monodroga-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">science</mat-icon>
        {{ data.item ? 'Editar Asociación Plan/Monodroga' : 'Nueva Asociación Plan / Monodroga' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Plan Cobertura (Obra Social Actual) *</mat-label>
            <input type="text" matInput formControlName="planInput" [matAutocomplete]="autoPlan" placeholder="Seleccionar plan de la Obra Social...">
            <mat-autocomplete #autoPlan="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onPlanSelected($event)">
              <mat-option *ngFor="let option of filteredPlanes | async" [value]="option">
                {{ option.descripcion }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('planId')?.hasError('required')">Plan obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Monodroga *</mat-label>
            <input type="text" matInput formControlName="monodrogaInput" [matAutocomplete]="autoMono" placeholder="Buscar monodroga...">
            <mat-autocomplete #autoMono="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onMonoSelected($event)">
              <mat-option *ngFor="let option of filteredMonodrogas | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('monodrogaId')?.hasError('required')">Monodroga obligatoria</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Laboratorio *</mat-label>
            <input type="text" matInput formControlName="laboratorioInput" [matAutocomplete]="autoLab" placeholder="Buscar laboratorio...">
            <mat-autocomplete #autoLab="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onLabSelected($event)">
              <mat-option *ngFor="let option of filteredLaboratorios | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('laboratorioId')?.hasError('required')">Laboratorio obligatorio</mat-error>
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
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; }
  `]
})
export class PlanMonodrogaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<PlanMonodrogaFormDialogComponent>);
  private service = inject(ObrasSocialesService);
  public data: { obraSocialId: number; item?: any } = inject(MAT_DIALOG_DATA);

  planesList: any[] = [];
  monodrogasList = [
    { id: 1, nombre: 'IBUPROFENO' },
    { id: 2, nombre: 'PARACETAMOL' },
    { id: 3, nombre: 'AMOXICILINA' }
  ];
  laboratoriosList = [
    { id: 1, nombre: 'LABORATORIOS BAYER' },
    { id: 2, nombre: 'ROEMMERS' },
    { id: 3, nombre: 'ELEA' }
  ];

  filteredPlanes!: Observable<any[]>;
  filteredMonodrogas!: Observable<any[]>;
  filteredLaboratorios!: Observable<any[]>;

  form = this.fb.group({
    id: [null as number | null],
    planId: [null as number | null, Validators.required],
    planInput: [null as any, Validators.required],
    monodrogaId: [null as number | null, Validators.required],
    monodrogaInput: [null as any, Validators.required],
    laboratorioId: [null as number | null, Validators.required],
    laboratorioInput: [null as any, Validators.required],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    this.service.getPlanesByObraSocial(this.data.obraSocialId).subscribe(res => {
      this.planesList = res;
      this.initFilters();

      if (this.data.item) {
        const planObj = this.planesList.find(x => x.id === this.data.item.planId);
        const monoObj = this.monodrogasList.find(x => x.id === this.data.item.monodrogaId);
        const labObj = this.laboratoriosList.find(x => x.id === this.data.item.laboratorioId);

        this.form.patchValue({
          id: this.data.item.id,
          planId: this.data.item.planId,
          planInput: planObj || { descripcion: this.data.item.planDescripcion },
          monodrogaId: this.data.item.monodrogaId,
          monodrogaInput: monoObj || { nombre: this.data.item.monodrogaNombre },
          laboratorioId: this.data.item.laboratorioId,
          laboratorioInput: labObj || { nombre: this.data.item.laboratorioNombre },
          activo: this.data.item.activo
        });
      }
    });
  }

  initFilters() {
    this.filteredPlanes = this.form.get('planInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.planesList, 'descripcion')));
    this.filteredMonodrogas = this.form.get('monodrogaInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.monodrogasList, 'nombre')));
    this.filteredLaboratorios = this.form.get('laboratorioInput')!.valueChanges.pipe(startWith(''), map(v => this._filter(v, this.laboratoriosList, 'nombre')));
  }

  displayFn(item: any): string {
    return item ? (item.descripcion || item.nombre || '') : '';
  }

  private _filter(val: any, list: any[], key: string) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val ? (val[key] || '').toLowerCase() : '');
    return list.filter(item => (item[key] || '').toLowerCase().includes(filterValue));
  }

  onPlanSelected(e: any) { this.form.patchValue({ planId: e.option.value.id }); }
  onMonoSelected(e: any) { this.form.patchValue({ monodrogaId: e.option.value.id }); }
  onLabSelected(e: any) { this.form.patchValue({ laboratorioId: e.option.value.id }); }

  onSave() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const planObj = typeof raw.planInput === 'object' ? raw.planInput : this.planesList.find(x => x.id === raw.planId);
      const monoObj = typeof raw.monodrogaInput === 'object' ? raw.monodrogaInput : this.monodrogasList.find(x => x.id === raw.monodrogaId);
      const labObj = typeof raw.laboratorioInput === 'object' ? raw.laboratorioInput : this.laboratoriosList.find(x => x.id === raw.laboratorioId);

      const payload = {
        ...(raw.id ? { id: raw.id } : {}),
        obraSocialId: this.data.obraSocialId,
        planId: raw.planId!,
        planDescripcion: planObj?.descripcion,
        monodrogaId: raw.monodrogaId!,
        monodrogaNombre: monoObj?.nombre,
        laboratorioId: raw.laboratorioId!,
        laboratorioNombre: labObj?.nombre,
        activo: raw.activo!
      };

      this.service.savePlanMonodroga(payload).subscribe({
        next: (res) => this.ref.close(res),
        error: (err) => alert(err.message)
      });
    }
  }
}
