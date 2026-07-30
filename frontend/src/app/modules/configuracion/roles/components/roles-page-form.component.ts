import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ModuloPermiso, LISTA_MODULOS_DEFAULT } from './roles.model';

@Component({
  selector: 'app-roles-page-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatButtonModule, MatTabsModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title notranslate" translate="no">
      <mat-icon color="primary">admin_panel_settings</mat-icon>
      {{ titleText }}
    </h2>

    <mat-dialog-content class="modal-content notranslate" translate="no">
      <mat-tab-group animationDuration="200ms">
        
        <!-- PESTAÑA 1: DATOS GENERALES DEL ROL -->
        <mat-tab label="1. Datos del Rol">
          <form [formGroup]="form" class="tab-form-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Código del Rol</mat-label>
              <input matInput formControlName="codigo" readonly style="font-weight: 700; color: #0284C7; background: #F0F9FF;">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del Rol</mat-label>
              <input matInput formControlName="nombre" placeholder="Ej: Auditor Senior">
              <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre del rol es obligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3" placeholder="Descripción de funciones y alcance de este perfil..."></textarea>
            </mat-form-field>

            <mat-slide-toggle formControlName="activo" color="primary">Estado Activo</mat-slide-toggle>
          </form>
        </mat-tab>

        <!-- PESTAÑA 2: ASIGNACIÓN DE PERMISOS -->
        <mat-tab label="2. Permisos por Módulo">
          <div class="permisos-tab-wrapper">
            <p class="hint-text">Configure las facultades de acceso (Lectura, Escritura, Eliminación, Auditoría) para este Rol.</p>
            
            <div class="table-container">
              <table class="permisos-table">
                <thead>
                  <tr>
                    <th>Módulo del Sistema</th>
                    <th class="text-center">Lectura</th>
                    <th class="text-center">Escritura</th>
                    <th class="text-center">Eliminación</th>
                    <th class="text-center">Auditoría</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of permisos">
                    <td>
                      <span class="cat-tag" [ngClass]="m.categoria">{{ m.categoria }}</span>
                      <strong class="modulo-name">{{ m.moduloNombre }}</strong>
                    </td>
                    <td class="text-center">
                      <mat-slide-toggle [(ngModel)]="m.lectura" color="primary"></mat-slide-toggle>
                    </td>
                    <td class="text-center">
                      <mat-slide-toggle [(ngModel)]="m.escritura" color="primary"></mat-slide-toggle>
                    </td>
                    <td class="text-center">
                      <mat-slide-toggle [(ngModel)]="m.eliminacion" color="warn"></mat-slide-toggle>
                    </td>
                    <td class="text-center">
                      <mat-slide-toggle [(ngModel)]="m.auditoria" color="primary"></mat-slide-toggle>
                    </td>
                    <td class="text-center">
                      <button mat-button color="primary" class="btn-sm" type="button" (click)="toggleAllModule(m, true)">Todos</button>
                      <button mat-button color="warn" class="btn-sm" type="button" (click)="toggleAllModule(m, false)">Ninguno</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">
        <mat-icon>save</mat-icon> Guardar Rol y Permisos
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--text-main); margin: 0; }
    .modal-content { width: 720px; max-width: 90vw; height: 500px; padding-top: 8px; }
    .tab-form-content { display: flex; flex-direction: column; gap: 10px; padding: 16px 4px; }
    .full-width { width: 100%; }
    
    .permisos-tab-wrapper { padding: 12px 0; }
    .hint-text { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; }
    .table-container { max-height: 380px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; }
    .permisos-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .permisos-table th { background: var(--bg-card); padding: 10px 12px; text-align: left; border-bottom: 2px solid var(--border-color); color: var(--text-main); font-weight: 700; position: sticky; top: 0; z-index: 2; }
    .permisos-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .text-center { text-align: center; }
    
    .cat-tag { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-right: 6px; }
    .CONFIGURACION { background: #FEF3C7; color: #92400E; }
    .GESTION_MEDICA { background: #E0F2FE; color: #075985; }
    .GENERAL { background: #F3E8FF; color: #6B21A8; }

    .modulo-name { color: var(--text-main); font-size: 0.88rem; }
    .btn-sm { font-size: 0.72rem; min-width: 54px; padding: 0 4px; line-height: 24px; }
  `]
})
export class RolesPageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RolesPageFormComponent>);
  public data: any = inject(MAT_DIALOG_DATA);

  titleText = 'Nuevo Rol';
  permisos: ModuloPermiso[] = [];

  form: FormGroup = this.fb.group({
    codigo: [{ value: '', disabled: true }],
    nombre: ['', Validators.required],
    descripcion: [''],
    activo: [true]
  });

  ngOnInit(): void {
    if (this.data && this.data.item) {
      this.titleText = 'Editar Rol y Permisos';
      this.form.patchValue(this.data.item);
      if (this.data.item.codigo) this.form.get('codigo')?.setValue(this.data.item.codigo);
      
      this.permisos = this.data.item.permisos && this.data.item.permisos.length > 0
        ? JSON.parse(JSON.stringify(this.data.item.permisos))
        : JSON.parse(JSON.stringify(LISTA_MODULOS_DEFAULT));
    } else {
      const count = (this.data?.totalItems || 0) + 1;
      this.form.get('codigo')?.setValue('ROL-' + String(count).padStart(3, '0'));
      this.permisos = JSON.parse(JSON.stringify(LISTA_MODULOS_DEFAULT));
    }
  }

  toggleAllModule(mod: ModuloPermiso, value: boolean): void {
    mod.lectura = value;
    mod.escritura = value;
    mod.eliminacion = value;
    mod.auditoria = value;
  }

  onSave(): void {
    if (this.form.valid) {
      const resultData = {
        ...this.form.getRawValue(),
        permisos: this.permisos
      };
      this.dialogRef.close(resultData);
    }
  }
}
