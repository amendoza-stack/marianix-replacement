import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FarmaciaColegioInterface } from '../models/farmacia.model';

@Injectable({ providedIn: 'root' })
export class FarmaciaColegioService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/salud/farmacia-colegios';

  private list: FarmaciaColegioInterface[] = [
    {
      id: 1,
      farmaciaId: 1,
      farmaciaCodigo: 'FAR-001',
      farmaciaNombre: 'FARMACIA CENTRAL BUENOS AIRES',
      farmaciaCuit: '30-71234567-8',
      farmaciaCuf: 'CUF-100294',
      colegioFarmaceuticoId: 1,
      colegioCodigo: 'COL-001',
      colegioFarmaceuticoNombre: 'COLEGIO DE FARMACÉUTICOS DE PROVINCIA DE BUENOS AIRES',
      estado: 'Activo',
      fechaAlta: '2026-01-20',
      usuarioAlta: 'ADMIN_SISTEMA',
      fechaModificacion: '2026-01-20',
      usuarioModificacion: 'ADMIN_SISTEMA',
      activo: true
    },
    {
      id: 2,
      farmaciaId: 2,
      farmaciaCodigo: 'FAR-002',
      farmaciaNombre: 'FARMACIA DEL SOL',
      farmaciaCuit: '30-68994021-4',
      farmaciaCuf: 'CUF-300192',
      colegioFarmaceuticoId: 2,
      colegioCodigo: 'COL-002',
      colegioFarmaceuticoNombre: 'COLEGIO FARMACÉUTICO DE CÓRDOBA',
      estado: 'Activo',
      fechaAlta: '2026-02-05',
      usuarioAlta: 'AUDITOR_MEDICO',
      fechaModificacion: '2026-02-05',
      usuarioModificacion: 'AUDITOR_MEDICO',
      activo: true
    }
  ];

  getAll(): Observable<FarmaciaColegioInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list.filter(x => x.activo !== false)))).pipe(delay(200));
  }

  getById(id: number): Observable<FarmaciaColegioInterface | undefined> {
    const item = this.list.find(x => x.id === id);
    return of(item ? JSON.parse(JSON.stringify(item)) : undefined).pipe(delay(200));
  }

  save(item: FarmaciaColegioInterface): Observable<FarmaciaColegioInterface> {
    const dup = this.list.find(x => 
      x.farmaciaId === item.farmaciaId && 
      x.colegioFarmaceuticoId === item.colegioFarmaceuticoId && 
      x.id !== item.id &&
      x.activo !== false
    );

    if (dup) {
      return throwError(() => new Error('La farmacia ya se encuentra asociada al Colegio Farmacéutico seleccionado.'));
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    const usuarioActual = 'ADMIN_SISTEMA';

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = {
          ...this.list[idx],
          ...item,
          fechaModificacion: fechaActual,
          usuarioModificacion: usuarioActual
        };
        return of(this.list[idx]).pipe(delay(200));
      }
    }

    const newItem: FarmaciaColegioInterface = {
      ...item,
      id: Date.now(),
      fechaAlta: fechaActual,
      usuarioAlta: usuarioActual,
      fechaModificacion: fechaActual,
      usuarioModificacion: usuarioActual,
      activo: true
    };
    this.list.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  deleteLogico(id: number): Observable<boolean> {
    const idx = this.list.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.list[idx].activo = false;
      return of(true).pipe(delay(200));
    }
    return of(false);
  }
}
