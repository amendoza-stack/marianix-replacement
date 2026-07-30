import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DrogaInterface, MonodrogaInterface, MaestroMedicamentoInterface } from '../models/medicamentos-master.model';

@Injectable({ providedIn: 'root' })
export class DrogasService {
  private list: DrogaInterface[] = [
    { id: 1, codigo: 'DRG-001', descripcion: 'ÁCIDO ACETILSALICÍLICO', activo: true },
    { id: 2, codigo: 'DRG-002', descripcion: 'IBUPROFENO', activo: true },
    { id: 3, codigo: 'DRG-003', descripcion: 'PARACETAMOL', activo: true }
  ];

  getAll(): Observable<DrogaInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(200));
  }

  save(item: DrogaInterface): Observable<DrogaInterface> {
    const dup = this.list.find(x => x.descripcion === item.descripcion && x.id !== item.id);
    if (dup) return throwError(() => new Error(`La droga '${item.descripcion}' ya se encuentra registrada.`));

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(200));
      }
    }
    const newItem: DrogaInterface = {
      ...item,
      id: Date.now(),
      codigo: 'DRG-' + String(this.list.length + 1).padStart(3, '0')
    };
    this.list.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  delete(id: number): Observable<boolean> {
    const idx = this.list.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.list.splice(idx, 1);
      return of(true).pipe(delay(200));
    }
    return of(false);
  }
}

@Injectable({ providedIn: 'root' })
export class MonodrogasService {
  private list: MonodrogaInterface[] = [
    { id: 1, codigo: 'MON-001', codigoSSS: 'SSS-4920', descripcion: 'ÁCIDO ACETILSALICÍLICO 500 MG', activo: true },
    { id: 2, codigo: 'MON-002', codigoSSS: 'SSS-8192', descripcion: 'IBUPROFENO 400 MG', activo: true },
    { id: 3, codigo: 'MON-003', codigoSSS: 'SSS-1029', descripcion: 'LOSARTÁN POTÁSICO 50 MG', activo: true }
  ];

  getAll(): Observable<MonodrogaInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(200));
  }

  save(item: MonodrogaInterface): Observable<MonodrogaInterface> {
    const dupSSS = this.list.find(x => x.codigoSSS === item.codigoSSS && x.id !== item.id);
    if (dupSSS) return throwError(() => new Error(`El Código SSS '${item.codigoSSS}' ya está registrado.`));

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(200));
      }
    }
    const newItem: MonodrogaInterface = {
      ...item,
      id: Date.now(),
      codigo: 'MON-' + String(this.list.length + 1).padStart(3, '0')
    };
    this.list.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  delete(id: number): Observable<boolean> {
    const idx = this.list.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.list.splice(idx, 1);
      return of(true).pipe(delay(200));
    }
    return of(false);
  }
}

@Injectable({ providedIn: 'root' })
export class MedicamentosMasterService {
  private list: MaestroMedicamentoInterface[] = [
    {
      id: 1, codigo: 'MED-001', descripcion: 'ASPIRINNET 500 MG x 30 COMP.', tamano: '30 COMPRIMIDOS',
      laboratorioId: 1, laboratorioNombre: 'LABORATORIOS BAGO S.A.', codOrigenPrecio: 'FAB', codIva: '21%',
      vigenciaFecha: '2026-12-31', codigoBarras: '7791234567890', monodrogaId: 1, monodrogaNombre: 'ÁCIDO ACETILSALICÍLICO 500 MG',
      potencia: '500 MG', formaFarmaceutica: 'COMPRIMIDO', viaAdministracion: 'ORAL', contenido: '30 UNIDADES',
      accion: 'ANALGÉSICO / ANTIPIRÉTICO', multidroga: 'No', estado: 'Activo'
    },
    {
      id: 2, codigo: 'MED-002', descripcion: 'IBUPROFENO 400 MG x 20 CÁPS.', tamano: '20 CÁPSULAS',
      laboratorioId: 2, laboratorioNombre: 'ROEMMERS S.A.I.C.F.', codOrigenPrecio: 'FAB', codIva: '21%',
      vigenciaFecha: '2026-10-15', codigoBarras: '7799876543210', monodrogaId: 2, monodrogaNombre: 'IBUPROFENO 400 MG',
      potencia: '400 MG', formaFarmaceutica: 'CÁPSULA BLANDA', viaAdministracion: 'ORAL', contenido: '20 UNIDADES',
      accion: 'ANTIINFLAMATORIO', multidroga: 'No', estado: 'Activo'
    }
  ];

  getAll(): Observable<MaestroMedicamentoInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(200));
  }

  save(item: MaestroMedicamentoInterface): Observable<MaestroMedicamentoInterface> {
    if (item.codigoBarras) {
      const dupBarra = this.list.find(x => x.codigoBarras === item.codigoBarras && x.id !== item.id);
      if (dupBarra) return throwError(() => new Error(`El Código de Barras '${item.codigoBarras}' ya se encuentra asignado a otro medicamento.`));
    }

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(200));
      }
    }
    const newItem: MaestroMedicamentoInterface = {
      ...item,
      id: Date.now(),
      codigo: 'MED-' + String(this.list.length + 1).padStart(3, '0')
    };
    this.list.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  delete(id: number): Observable<boolean> {
    const idx = this.list.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.list.splice(idx, 1);
      return of(true).pipe(delay(200));
    }
    return of(false);
  }
}
