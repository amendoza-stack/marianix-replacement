import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface RecetaMovimiento {
  id: string;
  fecha: string;
  farmacia: string;
  obraSocial: string;
  monto: number;
  estado: 'APROBADA' | 'AUDITORIA' | 'RECHAZADA';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatSelectModule,
    MatFormFieldModule, MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container notranslate" translate="no">
      
      <!-- HEADER DEL DASHBOARD -->
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">Panel de Control General</h1>
          <p class="page-subtitle">Monitoreo transaccional de recetas, farmacias y convenios en tiempo real</p>
        </div>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="period-selector">
            <mat-label>Período Fiscal</mat-label>
            <mat-select value="202607">
              <mat-option value="202607">Julio de 2026</mat-option>
              <mat-option value="202606">Junio de 2026</mat-option>
              <mat-option value="202605">Mayo de 2026</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" class="btn-refresh">
            <mat-icon>refresh</mat-icon> Actualizar
          </button>
        </div>
      </div>

      <!-- CARDS KPIS -->
      <div class="kpi-grid">
        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon-wrapper bg-blue-light">
              <mat-icon class="kpi-icon text-blue">store</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">Farmacias Activas</span>
              <span class="kpi-value">1.482</span>
              <span class="kpi-sub green">+12 este mes</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon-wrapper bg-green-light">
              <mat-icon class="kpi-icon text-green">receipt_long</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">Recetas Liquidadas</span>
              <span class="kpi-value">48.920</span>
              <span class="kpi-sub green">98,2% Aprobadas</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon-wrapper bg-purple-light">
              <mat-icon class="kpi-icon text-purple">verified</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">Reporte 331 (Vademécum)</span>
              <span class="kpi-value">94,6%</span>
              <span class="kpi-sub">Validación Automática</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <div class="kpi-icon-wrapper bg-amber-light">
              <mat-icon class="kpi-icon text-amber">payments</mat-icon>
            </div>
            <div class="kpi-info">
              <span class="kpi-label">Monto Total Liquidado</span>
              <span class="kpi-value">$ 184.520.000</span>
              <span class="kpi-sub">Período Julio 2026</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- ACCESOS RÁPIDOS -->
      <div class="quick-access-section">
        <h3 class="section-title">Accesos Rápidos</h3>
        <div class="quick-buttons-grid">
          <button mat-stroked-button class="quick-btn">
            <mat-icon color="primary">note_add</mat-icon>
            <span>Cargar Receta</span>
          </button>
          <button mat-stroked-button class="quick-btn">
            <mat-icon color="primary">upload_file</mat-icon>
            <span>Importar TXT</span>
          </button>
          <button mat-stroked-button class="quick-btn">
            <mat-icon color="primary">assessment</mat-icon>
            <span>Generar Reporte 331</span>
          </button>
          <button mat-stroked-button class="quick-btn">
            <mat-icon color="warn">find_in_page</mat-icon>
            <span>Auditar Pendientes</span>
          </button>
        </div>
      </div>

      <!-- SECCIÓN DE GRÁFICOS REPRESENTATIVOS -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Evolución de Recetas por Semana</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="bar-chart-mock">
              <div class="chart-bar-col">
                <span class="bar-val">10.2k</span>
                <div class="bar" style="height: 60%;"></div>
                <span class="bar-label">Sem 1</span>
              </div>
              <div class="chart-bar-col">
                <span class="bar-val">12.8k</span>
                <div class="bar" style="height: 75%;"></div>
                <span class="bar-label">Sem 2</span>
              </div>
              <div class="chart-bar-col">
                <span class="bar-val">14.1k</span>
                <div class="bar" style="height: 85%;"></div>
                <span class="bar-label">Sem 3</span>
              </div>
              <div class="chart-bar-col">
                <span class="bar-val">11.8k</span>
                <div class="bar" style="height: 70%;"></div>
                <span class="bar-label">Sem 4</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Participación por Obra Social</mat-card-title>
          </mat-card-header>
          <mat-card-content class="os-progress-list">
            <div class="progress-item">
              <div class="progress-info"><span>PAMI INSSJP</span><strong>42%</strong></div>
              <mat-progress-bar mode="determinate" value="42" color="primary"></mat-progress-bar>
            </div>
            <div class="progress-item">
              <div class="progress-info"><span>IOMA</span><strong>28%</strong></div>
              <mat-progress-bar mode="determinate" value="28" color="accent"></mat-progress-bar>
            </div>
            <div class="progress-item">
              <div class="progress-info"><span>OSDE</span><strong>18%</strong></div>
              <mat-progress-bar mode="determinate" value="18" color="primary"></mat-progress-bar>
            </div>
            <div class="progress-item">
              <div class="progress-info"><span>SWISS MEDICAL</span><strong>12%</strong></div>
              <mat-progress-bar mode="determinate" value="12" color="warn"></mat-progress-bar>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- ÚLTIMOS MOVIMIENTOS -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Últimos Movimientos de Recetas Auditas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentMovements" class="full-width-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>Nº Transacción</th>
              <td mat-cell *matCellDef="let element" class="font-mono text-blue font-bold">{{ element.id }}</td>
            </ng-container>

            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha / Hora</th>
              <td mat-cell *matCellDef="let element">{{ element.fecha }}</td>
            </ng-container>

            <ng-container matColumnDef="farmacia">
              <th mat-header-cell *matHeaderCellDef>Farmacia Prescriptora</th>
              <td mat-cell *matCellDef="let element">{{ element.farmacia }}</td>
            </ng-container>

            <ng-container matColumnDef="obraSocial">
              <th mat-header-cell *matHeaderCellDef>Obra Social</th>
              <td mat-cell *matCellDef="let element">{{ element.obraSocial }}</td>
            </ng-container>

            <ng-container matColumnDef="monto">
              <th mat-header-cell *matHeaderCellDef>Monto Total</th>
              <td mat-cell *matCellDef="let element" class="font-bold">$ {{ element.monto | number:'1.2-2' }}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado Auditoría</th>
              <td mat-cell *matCellDef="let element">
                <span class="badge" [ngClass]="{
                  'badge-success': element.estado === 'APROBADA',
                  'badge-warning': element.estado === 'AUDITORIA',
                  'badge-error': element.estado === 'RECHAZADA'
                }">
                  {{ element.estado }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 20px; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .page-subtitle { font-size: 0.88rem; color: var(--text-muted); margin: 4px 0 0 0; }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .period-selector { width: 170px; margin-bottom: -1.25em; }
    .btn-refresh { height: 48px; border-radius: 8px; font-weight: 700; background-color: var(--brand-primary) !important; }

    /* KPIS GRID */
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .kpi-card { border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: none; }
    .kpi-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 20px !important; }
    .kpi-icon-wrapper { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-icon { font-size: 28px; width: 28px; height: 28px; }
    
    .bg-blue-light { background-color: rgba(2, 132, 199, 0.12); }
    .text-blue { color: #0284C7; }
    .bg-green-light { background-color: rgba(16, 185, 129, 0.12); }
    .text-green { color: #10B981; }
    .bg-purple-light { background-color: rgba(168, 85, 247, 0.12); }
    .text-purple { color: #A855F7; }
    .bg-amber-light { background-color: rgba(245, 158, 11, 0.12); }
    .text-amber { color: #F59E0B; }

    .kpi-info { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); }
    .kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 2px 0; }
    .kpi-sub { font-size: 0.75rem; color: var(--text-muted); }
    .green { color: #10B981; font-weight: 700; }

    /* ACCESOS RÁPIDOS */
    .quick-access-section { display: flex; flex-direction: column; gap: 10px; }
    .section-title { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .quick-buttons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
    .quick-btn { height: 52px; border-radius: 10px; border-color: var(--border-color); display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; background: var(--bg-card); color: var(--text-main); }
    .quick-btn:hover { background-color: var(--border-color); }

    /* CHARTS */
    .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px; }
    .chart-card { border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: none; padding: 12px; }
    .bar-chart-mock { display: flex; justify-content: space-around; align-items: flex-end; height: 180px; padding-top: 20px; }
    .chart-bar-col { display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; width: 48px; }
    .bar-val { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
    .bar { width: 100%; background: var(--brand-primary); border-radius: 6px 6px 0 0; }
    .bar-label { font-size: 0.78rem; font-weight: 700; color: var(--text-main); }

    .os-progress-list { display: flex; flex-direction: column; gap: 16px; padding-top: 12px; }
    .progress-info { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--text-main); margin-bottom: 4px; }

    /* TABLE */
    .table-card { border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); box-shadow: none; padding: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; display: inline-block; }
    .badge-success { background: #DCFCE7; color: #15803D; }
    .badge-warning { background: #FEF3C7; color: #B45309; }
    .badge-error { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class DashboardComponent {
  displayedColumns: string[] = ['id', 'fecha', 'farmacia', 'obraSocial', 'monto', 'estado'];
  
  recentMovements: RecetaMovimiento[] = [
    { id: 'TX-2026-0891', fecha: '30/07/2026 14:22', farmacia: 'Farmacia Central Quilmes', obraSocial: 'PAMI INSSJP', monto: 14250.00, estado: 'APROBADA' },
    { id: 'TX-2026-0890', fecha: '30/07/2026 14:18', farmacia: 'Farmacia Sindical La Plata', obraSocial: 'IOMA', monto: 8900.50, estado: 'AUDITORIA' },
    { id: 'TX-2026-0889', fecha: '30/07/2026 14:05', farmacia: 'Farmacia Nueva Córdoba', obraSocial: 'OSDE', monto: 32100.00, estado: 'APROBADA' },
    { id: 'TX-2026-0888', fecha: '30/07/2026 13:50', farmacia: 'Farmacia Belgrano CABA', obraSocial: 'SWISS MEDICAL', monto: 19400.00, estado: 'RECHAZADA' },
    { id: 'TX-2026-0887', fecha: '30/07/2026 13:42', farmacia: 'Farmacia del Centro Rosario', obraSocial: 'PAMI INSSJP', monto: 6750.20, estado: 'APROBADA' }
  ];
}
