import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ObraSocialInterface, PlanCoberturaItem, FarmaciaOSItem, MonodrogaPlanItem } from '../models/gestion-salud.model';
import { ObrasSocialesService } from '../services/gestion-salud.service';

@Component({
  selector: 'app-obra-social-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule,
    MatButtonModule, MatIconModule, MatTableModule, MatSlideToggleModule
  ],
  template: `
    <div class="dialog-wrapper notranslate" translate="no">
      <div class="dialog-header">
        <div class="title-box">
          <mat-icon color="primary">local_hospital</mat-icon>
          <div>
            <h2>{{ isEdit() ? 'Gestión de Obra Social: ' + form.get('sigla')?.value : 'Nueva Obra Social' }}</h2>
            <p class="sub">Administre los datos generales, planes, farmacias prestadoras y vademécum de monodrogas</p>
          </div>
        </div>
      </div>

      <mat-dialog-content class="modal-content">
        <mat-tab-group animationDuration="150ms">
          
          <!-- TAB 1: DATOS GENERALES -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-ic">info</mat-icon> Datos Generales
            </ng-template>

            <form [formGroup]="form" class="tab-form-grid">
              <mat-form-field appearance="outline" class="col-half">
                <mat-label>Sigla / Nombre Corto *</mat-label>
                <input matInput formControlName="sigla" placeholder="PAMI INSSJP">
                <mat-error *ngIf="form.get('sigla')?.hasError('required')">Obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-half">
                <mat-label>CUIT *</mat-label>
                <input matInput formControlName="cuit" placeholder="30546670891">
                <mat-error *ngIf="form.get('cuit')?.hasError('required')">Obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-full">
                <mat-label>Razón Social Completa *</mat-label>
                <input matInput formControlName="razonSocial" placeholder="PROGRAMA DE ATENCIÓN MÉDICA INTEGRAL">
                <mat-error *ngIf="form.get('razonSocial')?.hasError('required')">Obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-half">
                <mat-label>Teléfono Contacto</mat-label>
                <input matInput formControlName="telefono" placeholder="0800-222-7264">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-half">
                <mat-label>Correo Electrónico (Email)</mat-label>
                <input matInput formControlName="email" placeholder="contacto@pami.org.ar">
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-half">
                <mat-label>Estado *</mat-label>
                <mat-select formControlName="estado">
                  <mat-option value="Activa">Activa</mat-option>
                  <mat-option value="Inactiva">Inactiva</mat-option>
                </mat-select>
              </mat-form-field>
            </form>
          </mat-tab>

          <!-- TAB 2: PLANES -->
          <mat-tab [disabled]="!isEdit()">
            <ng-template mat-tab-label>
              <mat-icon class="tab-ic">assignment</mat-icon> Planes Cobertura ({{ planes().length }})
            </ng-template>

            <div class="tab-sub-container">
              <div class="table-card-sub">
                <table class="sub-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre del Plan</th>
                      <th>% Cobertura</th>
                      <th>Copago Fijo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let p of planes()">
                      <td class="font-mono text-blue font-bold">{{ p.codigo }}</td>
                      <td><strong>{{ p.nombrePlan }}</strong></td>
                      <td>{{ p.coberturaPorcentaje }}%</td>
                      <td>$ {{ p.copagoFijo }}</td>
                      <td>
                        <span class="badge" [ngClass]="p.activo ? 'badge-active' : 'badge-inactive'">
                          {{ p.activo ? 'ACTIVO' : 'INACTIVO' }}
                        </span>
                      </td>
                    </tr>
                    <tr *ngIf="planes().length === 0">
                      <td colspan="5" class="text-center empty-msg">No hay planes registrados para esta Obra Social</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </mat-tab>

          <!-- TAB 3: FARMACIAS PRESTADORAS -->
          <mat-tab [disabled]="!isEdit()">
            <ng-template mat-tab-label>
              <mat-icon class="tab-ic">store</mat-icon> Farmacias OS ({{ farmacias().length }})
            </ng-template>

            <div class="tab-sub-container">
              <div class="table-card-sub">
                <table class="sub-table">
                  <thead>
                    <tr>
                      <th>CUIT</th>
                      <th>Razón Social Farmacia</th>
                      <th>Dirección</th>
                      <th>Localidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let f of farmacias()">
                      <td class="font-mono">{{ f.cuit }}</td>
                      <td><strong>{{ f.razonSocial }}</strong></td>
                      <td>{{ f.direccion }}</td>
                      <td>{{ f.localidad }}</td>
                      <td>
                        <span class="badge" [ngClass]="f.activa ? 'badge-active' : 'badge-inactive'">
                          {{ f.activa ? 'ACTIVA' : 'INACTIVA' }}
                        </span>
                      </td>
                    </tr>
                    <tr *ngIf="farmacias().length === 0">
                      <td colspan="5" class="text-center empty-msg">No hay farmacias prestadoras adheridas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </mat-tab>

          <!-- TAB 4: PLAN / MONODROGA -->
          <mat-tab [disabled]="!isEdit()">
            <ng-template mat-tab-label>
              <mat-icon class="tab-ic">medication</mat-icon> Plan / Monodroga ({{ monodrogas().length }})
            </ng-template>

            <div class="tab-sub-container">
              <div class="table-card-sub">
                <table class="sub-table">
                  <thead>
                    <tr>
                      <th>Monodroga / Principio Activo</th>
                      <th>Plan Aplicable</th>
                      <th>Cobertura Especial</th>
                      <th>Auditoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let m of monodrogas()">
                      <td><strong>{{ m.monodrogaNombre }}</strong></td>
                      <td>{{ m.planNombre }}</td>
                      <td>{{ m.coberturaEspecial }}%</td>
                      <td>
                        <span class="badge" [ngClass]="m.requiereAuditoria ? 'badge-warn' : 'badge-active'">
                          {{ m.requiereAuditoria ? 'REQUIERE AUDITORÍA' : 'DIRECTO' }}
                        </span>
                      </td>
                    </tr>
                    <tr *ngIf="monodrogas().length === 0">
                      <td colspan="4" class="text-center empty-msg">No hay reglas de monodroga parametrizadas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" class="btn-save" [disabled]="form.invalid" (click)="onSave()">
          <mat-icon>save</mat-icon> Guardar Obra Social
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper { width: 850px; max-width: 95vw; box-sizing: border-box; }
    .dialog-header { padding: 16px 20px 10px 20px; border-bottom: 1px solid var(--border-color); }
    .title-box { display: flex; align-items: center; gap: 12px; }
    .title-box h2 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .sub { font-size: 0.82rem; color: var(--text-muted); margin: 2px 0 0 0; }
    .modal-content { max-height: 70vh; overflow-y: auto; padding-top: 8px !important; }

    .tab-ic { font-size: 20px; width: 20px; height: 20px; margin-right: 6px; }
    .tab-form-grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 16px 4px; }
    .col-full { width: 100%; }
    .col-half { width: calc(50% - 6px); }

    .tab-sub-container { padding: 16px 4px; }
    .table-card-sub { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
    .sub-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .sub-table th { background: #F8FAFC; padding: 10px 12px; text-align: left; border-bottom: 2px solid var(--border-color); font-weight: 800; }
    body.dark-theme .sub-table th { background: #1E293B; }
    .sub-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); }
    
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-center { text-align: center; }
    .empty-msg { padding: 20px; color: var(--text-muted); font-style: italic; }

    .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
    .badge-warn { background: #FEF3C7; color: #B45309; }

    .dialog-actions { padding: 12px 20px !important; border-top: 1px solid var(--border-color); }
    .btn-save { height: 42px; font-weight: 700; background-color: var(--brand-primary) !important; }
  `]
})
export class ObraSocialDetailDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ObraSocialDetailDialogComponent>);
  private service = inject(ObrasSocialesService);
  public data: ObraSocialInterface = inject(MAT_DIALOG_DATA);

  isEdit = signal<boolean>(!!this.data);
  planes = signal<PlanCoberturaItem[]>([]);
  farmacias = signal<FarmaciaOSItem[]>([]);
  monodrogas = signal<MonodrogaPlanItem[]>([]);

  form: FormGroup = this.fb.group({
    id: [null],
    codigo: [''],
    sigla: ['', Validators.required],
    razonSocial: ['', Validators.required],
    cuit: ['', Validators.required],
    telefono: [''],
    email: [''],
    estado: ['Activa', Validators.required]
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      this.planes.set(this.data.planes || []);
      this.farmacias.set(this.data.farmacias || []);
      this.monodrogas.set(this.data.monodrogas || []);
    }
  }

  onSave(): void {
    if (this.form.invalid) return;
    const val = {
      ...this.data,
      ...this.form.getRawValue(),
      planes: this.planes(),
      farmacias: this.farmacias(),
      monodrogas: this.monodrogas()
    };

    this.service.saveObraSocial(val).subscribe(res => {
      this.dialogRef.close(res);
    });
  }
}
