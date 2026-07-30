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
import { FarmaciaColegioService } from '../services/farmacia-colegio.service';
import { FarmaciasService } from '../services/farmacias.service';

@Component({
  selector: 'app-farmacia-colegio-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">account_balance</mat-icon>
        {{ data ? 'Editar Asociación con Colegio' : 'Nueva Asociación Farmacia - Colegio' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <!-- AUTOCOMPLETE FARMACIA -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Farmacia *</mat-label>
            <input type="text" matInput formControlName="farmaciaInput" [matAutocomplete]="autoFarm" placeholder="Buscar farmacia por nombre, CUIT o CUF...">
            <mat-autocomplete #autoFarm="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onFarmaciaSelected($event)">
              <mat-option *ngFor="let option of filteredFarmacias | async" [value]="option">
                {{ option.nombre }} - CUIT: {{ option.cuit }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('farmaciaId')?.hasError('required')">Farmacia obligatoria</mat-error>
          </mat-form-field>

          <!-- AUTOCOMPLETE COLEGIO FARMACÉUTICO -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Colegio Farmacéutico *</mat-label>
            <input type="text" matInput formControlName="colegioInput" [matAutocomplete]="autoCol" placeholder="Buscar colegio por nombre...">
            <mat-autocomplete #autoCol="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onColegioSelected($event)">
              <mat-option *ngFor="let option of filteredColegios | async" [value]="option">
                {{ option.nombre }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('colegioFarmaceuticoId')?.hasError('required')">Colegio Farmacéutico obligatorio</mat-error>
          </mat-form-field>

          <!-- ESTADO -->
          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Estado *</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="Activo">Activo</mat-option>
              <mat-option value="Inactivo">Inactivo</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('estado')?.hasError('required')">Estado obligatorio</mat-error>
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
    .form-grid { display: flex; flex-wrap: wrap; gap: 12px; width: 100%; }
    .col-full { width: 100%; }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; background-color: var(--brand-primary) !important; }
  `]
})
export class FarmaciaColegioFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<FarmaciaColegioFormDialogComponent>);
  private service = inject(FarmaciaColegioService);
  private farmaciasService = inject(FarmaciasService);
  public data: any = inject(MAT_DIALOG_DATA);

  farmaciasList: { id: number; nombre: string; cuit: string; cuf: string; codigo: string }[] = [];
  colegiosList = [
    { id: 1, nombre: 'COLEGIO DE FARMACÉUTICOS DE PROVINCIA DE BUENOS AIRES', codigo: 'COL-001' },
    { id: 2, nombre: 'COLEGIO FARMACÉUTICO DE CÓRDOBA', codigo: 'COL-002' },
    { id: 3, nombre: 'COLEGIO DE FARMACÉUTICOS DE SANTA FE', codigo: 'COL-003' }
  ];

  filteredFarmacias!: Observable<any[]>;
  filteredColegios!: Observable<any[]>;

  form = this.fb.group({
    id: [null],
    farmaciaId: [null as number | null, Validators.required],
    farmaciaInput: [null as any, Validators.required],
    colegioFarmaceuticoId: [null as number | null, Validators.required],
    colegioInput: [null as any, Validators.required],
    estado: ['Activo', Validators.required]
  });

  ngOnInit() {
    this.farmaciasService.getAll().subscribe(res => {
      this.farmaciasList = res.map(x => ({
        id: x.id!,
        nombre: x.descripcion,
        cuit: x.cuit,
        cuf: x.cuf,
        codigo: x.codigo
      }));
      this.initFilters();

      if (this.data) {
        const farmSelected = this.farmaciasList.find(x => x.id === this.data.farmaciaId);
        const colSelected = this.colegiosList.find(x => x.id === this.data.colegioFarmaceuticoId);

        this.form.patchValue({
          id: this.data.id,
          farmaciaId: this.data.farmaciaId,
          farmaciaInput: farmSelected || { nombre: this.data.farmaciaNombre },
          colegioFarmaceuticoId: this.data.colegioFarmaceuticoId,
          colegioInput: colSelected || { nombre: this.data.colegioFarmaceuticoNombre },
          estado: this.data.estado
        });
      }
    });
  }

  initFilters() {
    this.filteredFarmacias = this.form.get('farmaciaInput')!.valueChanges.pipe(
      startWith(''),
      map((v: any) => this._filter(v, this.farmaciasList))
    );

    this.filteredColegios = this.form.get('colegioInput')!.valueChanges.pipe(
      startWith(''),
      map((v: any) => this._filter(v, this.colegiosList))
    );
  }

  displayFn(item: any): string {
    return item && item.nombre ? item.nombre : '';
  }

  private _filter(val: any, list: any[]) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val?.nombre ? val.nombre.toLowerCase() : '');
    return list.filter(item => item.nombre.toLowerCase().includes(filterValue) || (item.cuit && item.cuit.includes(filterValue)));
  }

  onFarmaciaSelected(e: any) {
    this.form.patchValue({ farmaciaId: e.option.value.id });
  }

  onColegioSelected(e: any) {
    this.form.patchValue({ colegioFarmaceuticoId: e.option.value.id });
  }

  onSave() {
    if (this.form.valid) {
      const formVal = this.form.getRawValue();
      const farmObj = typeof formVal.farmaciaInput === 'object' ? formVal.farmaciaInput : this.farmaciasList.find(x => x.id === formVal.farmaciaId);
      const colObj = typeof formVal.colegioInput === 'object' ? formVal.colegioInput : this.colegiosList.find(x => x.id === formVal.colegioFarmaceuticoId);

      const payload = {
        id: formVal.id,
        farmaciaId: formVal.farmaciaId!,
        farmaciaCodigo: farmObj?.codigo,
        farmaciaNombre: farmObj?.nombre,
        farmaciaCuit: farmObj?.cuit,
        farmaciaCuf: farmObj?.cuf,
        colegioFarmaceuticoId: formVal.colegioFarmaceuticoId!,
        colegioCodigo: colObj?.codigo,
        colegioFarmaceuticoNombre: colObj?.nombre,
        estado: formVal.estado as 'Activo' | 'Inactivo'
      };

      this.service.save(payload).subscribe({
        next: (res) => this.ref.close(res),
        error: (err) => alert(err.message)
      });
    }
  }
}
