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
import { FarmaciasService } from '../../farmacias/services/farmacias.service';

@Component({
  selector: 'app-farmacia-os-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-box notranslate" translate="no">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">local_pharmacy</mat-icon>
        {{ data.item ? 'Editar Convenio Farmacia OS' : 'Asociar Farmacia a Obra Social' }}
      </h2>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" class="form-grid">
          
          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Código Farmacia OS (CODFAROS) *</mat-label>
            <input matInput formControlName="codigoFarmaciaOs" placeholder="Ej: 102">
            <mat-error *ngIf="form.get('codigoFarmaciaOs')?.hasError('required')">Código obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-half">
            <mat-label>Estado *</mat-label>
            <mat-select formControlName="activo">
              <mat-option [value]="true">Activo</mat-option>
              <mat-option [value]="false">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="col-full">
            <mat-label>Farmacia (Padrón General) *</mat-label>
            <input type="text" matInput formControlName="farmaciaInput" [matAutocomplete]="autoFarm" placeholder="Buscar por Razón Social, CUIT o Código Interno...">
            <mat-autocomplete #autoFarm="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onFarmaciaSelected($event)">
              <mat-option *ngFor="let option of filteredFarmacias | async" [value]="option">
                <strong>{{ option.codigo }}</strong> - {{ option.descripcion }} (CUIT: {{ option.cuit }})
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="form.get('farmaciaId')?.hasError('required')">Farmacia obligatoria</mat-error>
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
    .col-half { width: calc(50% - 5px); }
    .dialog-actions { padding: 12px 16px !important; border-top: 1px solid var(--border-color); }
    .btn-save { font-weight: 700; height: 40px; padding: 0 20px; }
  `]
})
export class FarmaciaOsFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<FarmaciaOsFormDialogComponent>);
  private service = inject(ObrasSocialesService);
  private farmaciasService = inject(FarmaciasService);
  public data: { obraSocialId: number; item?: any } = inject(MAT_DIALOG_DATA);

  farmaciasPadron: any[] = [];
  filteredFarmacias!: Observable<any[]>;

  form = this.fb.group({
    id: [null as number | null],
    codigoFarmaciaOs: ['', Validators.required],
    farmaciaId: [null as number | null, Validators.required],
    farmaciaInput: [null as any, Validators.required],
    activo: [true, Validators.required]
  });

  ngOnInit() {
    this.farmaciasService.getAll().subscribe(res => {
      this.farmaciasPadron = res;
      this.filteredFarmacias = this.form.get('farmaciaInput')!.valueChanges.pipe(
        startWith(''),
        map(val => this._filter(val, this.farmaciasPadron))
      );

      if (this.data.item) {
        const farmSelected = this.farmaciasPadron.find(x => x.id === this.data.item.farmaciaId);
        this.form.patchValue({
          id: this.data.item.id,
          codigoFarmaciaOs: this.data.item.codigoFarmaciaOs,
          farmaciaId: this.data.item.farmaciaId,
          farmaciaInput: farmSelected || { descripcion: this.data.item.farmaciaRazonSocial, codigo: this.data.item.farmaciaCodigoInterno, cuit: this.data.item.farmaciaCuit },
          activo: this.data.item.activo
        });
      }
    });
  }

  displayFn(item: any): string {
    return item && item.descripcion ? `${item.codigo} - ${item.descripcion}` : '';
  }

  private _filter(val: any, list: any[]) {
    const filterValue = typeof val === 'string' ? val.toLowerCase() : (val?.descripcion ? val.descripcion.toLowerCase() : '');
    return list.filter(item => 
      item.descripcion.toLowerCase().includes(filterValue) || 
      item.codigo.toLowerCase().includes(filterValue) ||
      (item.cuit && item.cuit.includes(filterValue))
    );
  }

  onFarmaciaSelected(e: any) {
    this.form.patchValue({ farmaciaId: e.option.value.id });
  }

  onSave() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const farmObj = typeof raw.farmaciaInput === 'object' ? raw.farmaciaInput : this.farmaciasPadron.find(x => x.id === raw.farmaciaId);

      const payload = {
        ...(raw.id ? { id: raw.id } : {}),
        obraSocialId: this.data.obraSocialId,
        codigoFarmaciaOs: raw.codigoFarmaciaOs!.trim(),
        farmaciaId: raw.farmaciaId!,
        farmaciaCodigoInterno: farmObj?.codigo,
        farmaciaRazonSocial: farmObj?.descripcion,
        farmaciaCuit: farmObj?.cuit,
        activo: raw.activo!
      };

      this.service.saveFarmaciaOs(payload).subscribe({
        next: (res) => this.ref.close(res),
        error: (err) => alert(err.message)
      });
    }
  }
}
