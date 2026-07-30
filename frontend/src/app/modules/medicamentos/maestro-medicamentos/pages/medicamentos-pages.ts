import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DrogasService, MonodrogasService, MedicamentosMasterService } from '../services/medicamentos.service';
import { DrogaFormDialogComponent, MonodrogaFormDialogComponent, MedicamentoFormDialogComponent } from '../dialogs/medicamento-form-dialog.component';

@Component({
  selector: 'app-drogas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div><h1>Padrón de Drogas</h1><p class="subtitle">Gestión de principios activos base</p></div>
        <button mat-flat-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> Nueva Droga</button>
      </div>
      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar droga...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Código o descripción...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{el.codigo}}</td></ng-container>
          <ng-container matColumnDef="descripcion"><th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th><td mat-cell *matCellDef="let el"><strong>{{el.descripcion}}</strong></td></ng-container>
          <ng-container matColumnDef="activo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">{{el.activo ? 'ACTIVO' : 'INACTIVO'}}</span></td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th><td mat-cell *matCellDef="let el" class="text-center"><button mat-icon-button color="primary" (click)="openForm(el)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="onDelete(el)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-center { text-align: center; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class DrogasPageComponent implements OnInit {
  private service = inject(DrogasService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>([]);
  cols = ['codigo', 'descripcion', 'activo', 'acciones'];
  searchTerm = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe((res: any[]) => { this.dataSource.data = res; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }); }
  applyFilter() { this.dataSource.filter = this.searchTerm.trim().toLowerCase(); }
  openForm(item?: any) {
    this.dialog.open(DrogaFormDialogComponent, { width: '420px', data: item }).afterClosed().subscribe(res => {
      if (res) { this.snack.open('Droga guardada con éxito', 'Aceptar', { duration: 2500 }); this.load(); }
    });
  }
  onDelete(item: any) {
    if (confirm(`¿Eliminar droga '${item.descripcion}'?`)) {
      this.service.delete(item.id).subscribe(() => { this.snack.open('Droga eliminada', 'Aceptar', { duration: 2500 }); this.load(); });
    }
  }
}

@Component({
  selector: 'app-monodrogas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div><h1>Padrón de Monodrogas</h1><p class="subtitle">Gestión de principios activos con código SSS</p></div>
        <button mat-flat-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> Nueva Monodroga</button>
      </div>
      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar monodroga...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Código SSS o descripción...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{el.codigo}}</td></ng-container>
          <ng-container matColumnDef="codigoSSS"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código SSS</th><td mat-cell *matCellDef="let el" class="font-mono">{{el.codigoSSS}}</td></ng-container>
          <ng-container matColumnDef="descripcion"><th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th><td mat-cell *matCellDef="let el"><strong>{{el.descripcion}}</strong></td></ng-container>
          <ng-container matColumnDef="activo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.activo ? 'badge-active' : 'badge-inactive'">{{el.activo ? 'ACTIVO' : 'INACTIVO'}}</span></td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th><td mat-cell *matCellDef="let el" class="text-center"><button mat-icon-button color="primary" (click)="openForm(el)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="onDelete(el)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-center { text-align: center; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class MonodrogasPageComponent implements OnInit {
  private service = inject(MonodrogasService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>([]);
  cols = ['codigo', 'codigoSSS', 'descripcion', 'activo', 'acciones'];
  searchTerm = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe((res: any[]) => { this.dataSource.data = res; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }); }
  applyFilter() { this.dataSource.filter = this.searchTerm.trim().toLowerCase(); }
  openForm(item?: any) {
    this.dialog.open(MonodrogaFormDialogComponent, { width: '440px', data: item }).afterClosed().subscribe(res => {
      if (res) { this.snack.open('Monodroga guardada con éxito', 'Aceptar', { duration: 2500 }); this.load(); }
    });
  }
  onDelete(item: any) {
    if (confirm(`¿Eliminar monodroga '${item.descripcion}'?`)) {
      this.service.delete(item.id).subscribe(() => { this.snack.open('Monodroga eliminada', 'Aceptar', { duration: 2500 }); this.load(); });
    }
  }
}

@Component({
  selector: 'app-maestro-medicamentos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="page-container notranslate" translate="no">
      <div class="header-actions">
        <div><h1>Maestro de Medicamentos</h1><p class="subtitle">Padrón comercial y clínico de troqueles y medicamentos</p></div>
        <button mat-flat-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> Nuevo Medicamento</button>
      </div>
      <div class="card-table">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar medicamento...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Código, descripción, laboratorio o monodroga...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <table mat-table [dataSource]="dataSource" matSort class="full-width-table">
          <ng-container matColumnDef="codigo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th><td mat-cell *matCellDef="let el" class="font-mono text-blue font-bold">{{el.codigo}}</td></ng-container>
          <ng-container matColumnDef="descripcion"><th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción Comercial</th><td mat-cell *matCellDef="let el"><strong>{{el.descripcion}}</strong></td></ng-container>
          <ng-container matColumnDef="laboratorio"><th mat-header-cell *matHeaderCellDef mat-sort-header>Laboratorio</th><td mat-cell *matCellDef="let el">{{el.laboratorioNombre}}</td></ng-container>
          <ng-container matColumnDef="monodroga"><th mat-header-cell *matHeaderCellDef mat-sort-header>Monodroga</th><td mat-cell *matCellDef="let el">{{el.monodrogaNombre}}</td></ng-container>
          <ng-container matColumnDef="vigencia"><th mat-header-cell *matHeaderCellDef mat-sort-header>Vigencia</th><td mat-cell *matCellDef="let el">{{el.vigenciaFecha}}</td></ng-container>
          <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let el"><span class="badge" [ngClass]="el.estado === 'Activo' ? 'badge-active' : 'badge-inactive'">{{el.estado}}</span></td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef class="text-center">Acciones</th><td mat-cell *matCellDef="let el" class="text-center"><button mat-icon-button color="primary" (click)="openForm(el)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="onDelete(el)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; }
    .card-table { background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color); }
    .search-field { width: 100%; margin-bottom: 12px; }
    .full-width-table { width: 100%; background: transparent; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: 700; }
    .text-blue { color: var(--brand-accent); }
    .text-center { text-align: center; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge-active { background: #DCFCE7; color: #15803D; }
    .badge-inactive { background: #FEE2E2; color: #B91C1C; }
  `]
})
export class MaestroMedicamentosPageComponent implements OnInit {
  private service = inject(MedicamentosMasterService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>([]);
  cols = ['codigo', 'descripcion', 'laboratorio', 'monodroga', 'vigencia', 'estado', 'acciones'];
  searchTerm = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe((res: any[]) => { this.dataSource.data = res; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }); }
  applyFilter() { this.dataSource.filter = this.searchTerm.trim().toLowerCase(); }
  openForm(item?: any) {
    this.dialog.open(MedicamentoFormDialogComponent, { width: '680px', data: item }).afterClosed().subscribe(res => {
      if (res) { this.snack.open('Medicamento guardado con éxito', 'Aceptar', { duration: 2500 }); this.load(); }
    });
  }
  onDelete(item: any) {
    if (confirm(`¿Eliminar medicamento '${item.descripcion}'?`)) {
      this.service.delete(item.id).subscribe(() => { this.snack.open('Medicamento eliminado', 'Aceptar', { duration: 2500 }); this.load(); });
    }
  }
}
