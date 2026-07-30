import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportacionNovedadesService } from '../services/importacion-novedades.service';
import { NovedadItemDto, ValidacionArchivoResultadoDto, HistorialImportacionInterface } from '../models/importacion-novedades.model';

@Component({
  selector: 'app-importacion-novedades-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule,
    MatTabsModule, MatTooltipModule
  ],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Importación de Novedades</h1>
          <p class="page-subtitle">Actualización masiva e inserción de nuevos medicamentos mediante archivos (CSV, TXT, XLS, XLSX)</p>
        </div>
      </div>

      <mat-tab-group animationDuration="150ms">
        
        <!-- PESTAÑA 1: PROCESO DE IMPORTACIÓN -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-ic">file_upload</mat-icon> Cargar Novedades
          </ng-template>

          <div class="tab-content">
            <!-- SECCIÓN BÚSQUEDA Y CARGA -->
            <div class="file-upload-card">
              <input type="file" #fileInput (change)="onFileSelected($event)" accept=".csv,.txt,.xls,.xlsx" style="display:none">
              
              <div class="upload-controls">
                <button mat-flat-button color="primary" class="btn-action" (click)="fileInput.click()" [disabled]="cargando">
                  <mat-icon>attach_file</mat-icon> Seleccionar Archivo
                </button>
                
                <span class="file-name" *ngIf="selectedFile">
                  <mat-icon color="accent">description</mat-icon> {{ selectedFile.name }} ({{ (selectedFile.size / 1024).toFixed(1) }} KB)
                </span>
                <span class="file-name empty" *ngIf="!selectedFile">Ningún archivo seleccionado</span>

                <div class="action-buttons" *ngIf="validacionResultado">
                  <button mat-flat-button color="accent" class="btn-action" (click)="onImportar()" [disabled]="cargando || validacionResultado.cantidadTotal === 0 || validacionResultado.cantidadErrores === validacionResultado.cantidadTotal">
                    <mat-icon>cloud_upload</mat-icon> Importar
                  </button>
                  <button mat-stroked-button color="warn" class="btn-action" (click)="onCancelar()" [disabled]="cargando">
                    <mat-icon>close</mat-icon> Cancelar
                  </button>
                  <button mat-stroked-button (click)="onReprocesar()" [disabled]="cargando">
                    <mat-icon>refresh</mat-icon> Reprocesar
                  </button>
                  <button mat-stroked-button color="primary" (click)="onExportarErrores()" [disabled]="!hasErrores()">
                    <mat-icon>download</mat-icon> Exportar Errores
                  </button>
                </div>
              </div>

              <mat-progress-bar mode="indeterminate" *ngIf="cargando" class="progress"></mat-progress-bar>
            </div>

            <!-- TARJETAS DE MÉTRICAS -->
            <div class="metrics-grid" *ngIf="validacionResultado">
              <div class="metric-card metric-total">
                <div class="metric-val">{{ validacionResultado.cantidadTotal }}</div>
                <div class="metric-lbl">Total Registros</div>
              </div>
              <div class="metric-card metric-insert">
                <div class="metric-val">{{ validacionResultado.cantidadInsertar }}</div>
                <div class="metric-lbl">A Insertar</div>
              </div>
              <div class="metric-card metric-update">
                <div class="metric-val">{{ validacionResultado.cantidadActualizar }}</div>
                <div class="metric-lbl">A Actualizar</div>
              </div>
              <div class="metric-card metric-error">
                <div class="metric-val">{{ validacionResultado.cantidadErrores }}</div>
                <div class="metric-lbl">Errores</div>
              </div>
              <div class="metric-card metric-warn">
                <div class="metric-val">{{ validacionResultado.cantidadAdvertencias }}</div>
                <div class="metric-lbl">Advertencias</div>
              </div>
            </div>

            <!-- TABLA VISTA PREVIA -->
            <div class="card-table" *ngIf="validacionResultado">
              <h3 class="table-title">Vista Previa y Validaciones Estratégicas</h3>
              
              <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
                <ng-container matColumnDef="linea">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header># Lógica</th>
                  <td mat-cell *matCellDef="let el" class="font-mono">{{ el.lineaIndex }}</td>
                </ng-container>

                <ng-container matColumnDef="codigo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
                  <td mat-cell *matCellDef="let el" class="font-mono font-bold text-blue">{{ el.codigo || 'NUEVO' }}</td>
                </ng-container>

                <ng-container matColumnDef="descripcion">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
                  <td mat-cell *matCellDef="let el"><strong>{{ el.descripcion }}</strong></td>
                </ng-container>

                <ng-container matColumnDef="laboratorio">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Laboratorio</th>
                  <td mat-cell *matCellDef="let el">{{ el.laboratorioNombre || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="monodroga">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Monodroga</th>
                  <td mat-cell *matCellDef="let el">{{ el.monodrogaNombre || 'N/A' }}</td>
                </ng-container>

                <ng-container matColumnDef="precioVenta">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>P. Venta</th>
                  <td mat-cell *matCellDef="let el" class="font-mono">$ {{ el.precioVenta || 0 }}</td>
                </ng-container>

                <ng-container matColumnDef="accion">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Acción</th>
                  <td mat-cell *matCellDef="let el">
                    <span class="badge" [ngClass]="el.accionPlanificada === 'Insertar' ? 'badge-insert' : (el.accionPlanificada === 'Actualizar' ? 'badge-update' : 'badge-reject')">
                      {{ el.accionPlanificada }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado Validaciones</th>
                  <td mat-cell *matCellDef="let el">
                    <span class="badge" [ngClass]="el.estadoFila === 'Valido' ? 'badge-active' : (el.estadoFila === 'Advertencia' ? 'badge-warn' : 'badge-inactive')">
                      {{ el.estadoFila }}
                    </span>
                    <span class="err-msg" *ngIf="el.mensajesValidacion?.length > 0" [matTooltip]="el.mensajesValidacion.join(' | ')">
                      <mat-icon class="ic-err">info</mat-icon>
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="cols"></tr>
                <tr mat-row *matRowDef="let row; columns: cols;"></tr>
              </table>

              <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
            </div>
          </div>
        </mat-tab>

        <!-- PESTAÑA 2: HISTORIAL DE IMPORTACIONES -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-ic">history</mat-icon> Historial de Procesamientos
          </ng-template>

          <div class="tab-content">
            <div class="card-table">
              <table mat-table [dataSource]="historialDataSource" matSort class="full-width-table">
                <ng-container matColumnDef="fecha">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
                  <td mat-cell *matCellDef="let el">{{ el.fecha }}</td>
                </ng-container>

                <ng-container matColumnDef="usuario">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario</th>
                  <td mat-cell *matCellDef="let el"><strong>{{ el.usuario }}</strong></td>
                </ng-container>

                <ng-container matColumnDef="archivo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Archivo</th>
                  <td mat-cell *matCellDef="let el" class="font-mono text-blue">{{ el.archivoNombre }}</td>
                </ng-container>

                <ng-container matColumnDef="insertados">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Insertados</th>
                  <td mat-cell *matCellDef="let el" class="text-center font-bold text-green">{{ el.cantidadInsertados }}</td>
                </ng-container>

                <ng-container matColumnDef="actualizados">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Actualizados</th>
                  <td mat-cell *matCellDef="let el" class="text-center font-bold text-blue">{{ el.cantidadActualizados }}</td>
                </ng-container>

                <ng-container matColumnDef="rechazados">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Rechazados</th>
                  <td mat-cell *matCellDef="let el" class="text-center font-bold text-red">{{ el.cantidadRechazados }}</td>
                </ng-container>

                <ng-container matColumnDef="tiempo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Tiempo</th>
                  <td mat-cell *matCellDef="let el">{{ el.tiempoProcesamientoSegundos }}s</td>
                </ng-container>

                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                  <td mat-cell *matCellDef="let el">
                    <span class="badge" [ngClass]="el.estado === 'Exitoso' ? 'badge-active' : (el.estado === 'Parcial' ? 'badge-warn' : 'badge-inactive')">
                      {{ el.estado }}
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="historialCols"></tr>
                <tr mat-row *matRowDef="let row; columns: historialCols;"></tr>
              </table>

              <mat-paginator #histPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .page-title { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .tab-ic { font-size: 20px; width: 20px; height: 20px; margin-right: 6px; }
    .tab-content { padding-top: 16px; display: flex; flex-direction: column; gap: 16px; }

    .file-upload-card { background: var(--bg-card); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); }
    .upload-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
    .file-name { font-size: 0.9rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px; }
    .file-name.empty { color: var(--text-muted); font-style: italic; font-weight: 400; }
    .action-buttons { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .btn-action { font-weight: 700; height: 40px; }
    .progress { margin-top: 12px; border-radius: 4px; }

    .metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .metric-card { background: var(--bg-card); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-color); text-align: center; }
    .metric-val { font-size: 1.5rem; font-weight: 900; }
    .metric-lbl { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-top: 2px; }
    
    .metric-total .metric-val { color: var(--brand-accent); }
    .metric-insert .metric-val { color: #16A34A; }
    .metric-update .metric-val { color: #2563EB; }
    .metric-error .metric-val { color: #DC2626; }
    .metric-warn .metric-val { color: #D97706; }

    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .table-title { font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 12px 0; }
    .full-width-table { width: 100%; background: transparent; }
    
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-green { color: #16A34A; }
    .text-red { color: #DC2626; }
    .text-center { text-align: center; }

    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
    .badge-warn { background: #FEF3C7; color: #B45309; }
    .badge-insert { background: #E0F2FE; color: #0369A1; }
    .badge-update { background: #F3E8FF; color: #6B21A8; }
    .badge-reject { background: #FEE2E2; color: #991B1B; }

    .err-msg { vertical-align: middle; margin-left: 6px; cursor: pointer; }
    .ic-err { font-size: 16px; width: 16px; height: 16px; color: #D97706; }
  `]
})
export class ImportacionNovedadesPageComponent implements OnInit {
  private service = inject(ImportacionNovedadesService);
  private snack = inject(MatSnackBar);

  selectedFile: File | null = null;
  cargando = false;
  validacionResultado: ValidacionArchivoResultadoDto | null = null;

  dataSource = new MatTableDataSource<NovedadItemDto>([]);
  cols = ['linea', 'codigo', 'descripcion', 'laboratorio', 'monodroga', 'precioVenta', 'accion', 'estado'];

  historialDataSource = new MatTableDataSource<HistorialImportacionInterface>([]);
  historialCols = ['fecha', 'usuario', 'archivo', 'insertados', 'actualizados', 'rechazados', 'tiempo', 'estado'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('histPaginator') histPaginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.validarArchivo();
    }
  }

  validarArchivo(): void {
    if (!this.selectedFile) return;
    this.cargando = true;
    this.service.validarArchivo(this.selectedFile).subscribe({
      next: (res) => {
        this.cargando = false;
        this.validacionResultado = res;
        this.dataSource.data = res.items || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.snack.open('Archivo analizado con éxito.', 'Aceptar', { duration: 2500 });
      },
      error: (err) => {
        this.cargando = false;
        this.snack.open(err?.error?.message || 'Error al validar la estructura del archivo.', 'Aceptar', { duration: 3500 });
      }
    });
  }

  onImportar(): void {
    if (!this.selectedFile) return;
    this.cargando = true;
    this.service.procesarImportacion(this.selectedFile).subscribe({
      next: (res) => {
        this.cargando = false;
        this.snack.open(`Importación finalizada. Insertados: ${res.cantidadInsertados}, Actualizados: ${res.cantidadActualizados}`, 'Aceptar', { duration: 4000 });
        this.onCancelar();
        this.cargarHistorial();
      },
      error: (err) => {
        this.cargando = false;
        this.snack.open(err?.error?.message || 'Error al procesar la importación.', 'Aceptar', { duration: 3500 });
      }
    });
  }

  onCancelar(): void {
    this.selectedFile = null;
    this.validacionResultado = null;
    this.dataSource.data = [];
  }

  onReprocesar(): void {
    if (this.selectedFile) {
      this.validarArchivo();
    }
  }

  onExportarErrores(): void {
    if (this.validacionResultado?.items) {
      this.service.exportarErroresCsv(this.validacionResultado.items);
    }
  }

  hasErrores(): boolean {
    return (this.validacionResultado?.cantidadErrores || 0) > 0;
  }

  cargarHistorial(): void {
    this.service.getHistorial().subscribe({
      next: (res) => {
        this.historialDataSource.data = res || [];
        this.historialDataSource.paginator = this.histPaginator;
      },
      error: () => {}
    });
  }
}
