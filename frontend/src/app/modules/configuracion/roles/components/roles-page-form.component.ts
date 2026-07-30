import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModuloPermiso, LISTA_MODULOS_DEFAULT } from './roles.model';

@Component({
  selector: 'app-roles-page-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatButtonModule, MatIconModule
  ],
  template: `
    <div class="single-screen-dialog notranslate" translate="no">
      
      <!-- HEADER -->
      <div class="dialog-header">
        <div class="header-title-group">
          <mat-icon class="header-icon">admin_panel_settings</mat-icon>
          <div>
            <h2>{{ titleText }}</h2>
            <p class="header-sub">Defina las características del rol y configure los permisos de acceso en una sola vista</p>
          </div>
        </div>
      </div>

      <mat-dialog-content class="modal-body-scroll">
        <!-- SECCIÓN 1: DATOS DEL ROL -->
        <div class="section-card">
          <div class="section-title">
            <mat-icon class="sec-icon">badge</mat-icon> 1. Informacion Principal del Rol
          </div>

          <form [formGroup]="form" class="form-grid">
            <div class="grid-col-1">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Código</mat-label>
                <input matInput formControlName="codigo" readonly class="code-input">
              </mat-form-field>
            </div>

            <div class="grid-col-2">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del Rol *</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej: Auditor Senior">
                <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre es requerido</mat-error>
              </mat-form-field>
            </div>

            <div class="grid-col-1 center-toggle">
              <mat-slide-toggle formControlName="activo" color="primary">Estado Activo</mat-slide-toggle>
            </div>

            <div class="grid-col-full">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción / Observaciones</mat-label>
                <input matInput formControlName="descripcion" placeholder="Alcance operativo y perfil de seguridad asignado...">
              </mat-form-field>
            </div>
          </form>
        </div>

        <!-- SECCIÓN 2: MATRIZ COMPLETA DE PERMISOS -->
        <div class="section-card margin-top-16">
          <div class="section-title space-between">
            <div class="title-with-icon">
              <mat-icon class="sec-icon">vpn_key</mat-icon> 2. Permisos por Módulo (21 Módulos)
            </div>
            <div class="global-actions">
              <button mat-stroked-button color="primary" type="button" class="btn-xs" (click)="toggleAllGlobal(true)">
                <mat-icon class="btn-ic">done_all</mat-icon> Marcar Todos
              </button>
              <button mat-stroked-button color="warn" type="button" class="btn-xs" (click)="toggleAllGlobal(false)">
                <mat-icon class="btn-ic">remove_done</mat-icon> Desmarcar Todos
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="permisos-table">
              <thead>
                <tr>
                  <th class="col-mod">Módulo del Sistema</th>
                  <th class="col-sw text-center">Lectura</th>
                  <th class="col-sw text-center">Escritura</th>
                  <th class="col-sw text-center">Eliminación</th>
                  <th class="col-sw text-center">Auditoría</th>
                  <th class="col-act text-center">Acción Rápida</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of permisos">
                  <td class="col-mod">
                    <div class="mod-cell">
                      <span class="cat-tag" [ngClass]="m.categoria">{{ m.categoria }}</span>
                      <strong class="mod-name">{{ m.moduloNombre }}</strong>
                    </div>
                  </td>
                  <td class="col-sw text-center">
                    <mat-slide-toggle [(ngModel)]="m.lectura" color="primary"></mat-slide-toggle>
                  </td>
                  <td class="col-sw text-center">
                    <mat-slide-toggle [(ngModel)]="m.escritura" color="primary"></mat-slide-toggle>
                  </td>
                  <td class="col-sw text-center">
                    <mat-slide-toggle [(ngModel)]="m.eliminacion" color="warn"></mat-slide-toggle>
                  </td>
                  <td class="col-sw text-center">
                    <mat-slide-toggle [(ngModel)]="m.auditoria" color="primary"></mat-slide-toggle>
                  </td>
                  <td class="col-act text-center">
                    <button mat-button color="primary" class="btn-micro" type="button" (click)="toggleAllModule(m, true)">Todos</button>
                    <button mat-button color="warn" class="btn-micro" type="button" (click)="toggleAllModule(m, false)">Ninguno</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </mat-dialog-content>

      <!-- FOOTER -->
      <mat-dialog-actions align="end" class="dialog-footer">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" class="btn-save" [disabled]="form.invalid" (click)="onSave()">
          <mat-icon>save</mat-icon> Guardar Rol y Permisos
        </button>
      </mat-dialog-actions>

    </div>
  `,
  styles: [`
    .single-screen-dialog { width: 100%; box-sizing: border-box; }
    .dialog-header { padding: 16px 20px 12px 20px; border-bottom: 1px solid var(--border-color); }
    .header-title-group { display: flex; align-items: center; gap: 12px; }
    .header-icon { font-size: 32px; width: 32px; height: 32px; color: var(--brand-accent); }
    .header-title-group h2 { font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .header-sub { font-size: 0.82rem; color: var(--text-muted); margin: 2px 0 0 0; }

    .modal-body-scroll { max-height: 70vh; overflow-y: auto; padding: 16px 20px !important; }

    .section-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; }
    .margin-top-16 { margin-top: 16px; }
    .section-title { font-size: 0.92rem; font-weight: 800; color: var(--brand-primary); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .sec-icon { font-size: 20px; width: 20px; height: 20px; color: var(--brand-accent); }
    .space-between { justify-content: space-between; }
    .title-with-icon { display: flex; align-items: center; gap: 8px; }

    .form-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 12px; align-items: center; }
    .grid-col-1 { grid-column: span 1; }
    .grid-col-2 { grid-column: span 1; }
    .grid-col-full { grid-column: span 3; }
    .center-toggle { display: flex; align-items: center; justify-content: flex-end; padding-bottom: 16px; }
    .full-width { width: 100%; }
    .code-input { font-weight: 800; color: #0284C7 !important; background: #F0F9FF !important; }

    .global-actions { display: flex; gap: 8px; }
    .btn-xs { font-size: 0.75rem; height: 32px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
    .btn-ic { font-size: 16px; width: 16px; height: 16px; }

    .table-container { max-height: 320px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; }
    .permisos-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 860px; }
    .permisos-table th { background: #F8FAFC; padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color); color: var(--text-main); font-weight: 800; position: sticky; top: 0; z-index: 2; }
    body.dark-theme .permisos-table th { background: #1E293B; }
    .permisos-table td { padding: 8px 10px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }

    .col-mod { width: 320px; }
    .col-sw { width: 110px; }
    .col-act { width: 140px; }
    .text-center { text-align: center; }

    .mod-cell { display: flex; align-items: center; gap: 8px; }
    .cat-tag { font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
    .CONFIGURACION { background: #FEF3C7; color: #92400E; }
    .GESTION_MEDICA { background: #E0F2FE; color: #075985; }
    .GENERAL { background: #F3E8FF; color: #6B21A8; }
    .mod-name { color: var(--text-main); font-size: 0.86rem; }

    .btn-micro { font-size: 0.7rem; min-width: 48px; padding: 0 4px; line-height: 22px; }

    .dialog-footer { padding: 12px 20px !important; border-top: 1px solid var(--border-color); }
    .btn-save { height: 42px; font-weight: 700; padding: 0 24px; background-color: var(--brand-primary) !important; }
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

  toggleAllGlobal(status: boolean): void {
    this.permisos.forEach(m => {
      m.lectura = status;
      m.escritura = status;
      m.eliminacion = status;
      m.auditoria = status;
    });
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
