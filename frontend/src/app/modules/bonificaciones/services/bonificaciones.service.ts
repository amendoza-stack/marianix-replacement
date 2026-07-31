import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  BonificacionInterface, 
  BonificacionConsultaRecetaRequestDto, 
  BonificacionConsultaRecetaResponseDto 
} from '../models/bonificacion.model';

@Injectable({ providedIn: 'root' })
export class BonificacionesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/bonificaciones';

  private list: BonificacionInterface[] = [
    {
      id: 1,
      codigo: 'BON-001',
      descripcion: 'BONIFICACIÓN PADRÓN GENERAL OSDE PLAN 210',
      categoriaId: 1, categoriaNombre: 'ÉTICO (E)',
      obraSocialId: 1, obraSocialNombre: 'OSDE ORGANIZACIÓN DE SERVICIOS DIRECTOS EMPRESARIOS',
      planId: 1, planNombre: 'PLAN 210',
      ubicacionId: 2, ubicacionNombre: 'SUCURSAL CÓRDOBA',
      farmaciaId: 1, farmaciaOsConvenioId: 101, codigoFarmaciaOs: '444', farmaciaNombre: 'FARMACIA CENTRAL BUENOS AIRES',
      valor1: 8.0,
      valor2: 90.0,
      activo: true,
      fechaAlta: '2026-02-10',
      usuarioAlta: 'ADMIN_SISTEMA'
    },
    {
      id: 2,
      codigo: 'BON-002',
      descripcion: 'DESCUENTO ESPECIAL SWISS MEDICAL CORDOBA',
      categoriaId: 2, categoriaNombre: 'GENÉRICO (G)',
      obraSocialId: 2, obraSocialNombre: 'SWISS MEDICAL S.A.',
      planId: 3, planNombre: 'PLAN SMG20',
      ubicacionId: 2, ubicacionNombre: 'SUCURSAL CÓRDOBA',
      farmaciaId: 2, farmaciaOsConvenioId: 102, codigoFarmaciaOs: '444', farmaciaNombre: 'FARMACIA DEL SOL',
      valor1: 22.0,
      valor2: 90.0,
      activo: true,
      fechaAlta: '2026-02-18',
      usuarioAlta: 'AUDITOR_MEDICO'
    }
  ];

  getAll(): Observable<BonificacionInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list.filter(x => x.activo !== false)))).pipe(delay(200));
  }

  getById(id: number): Observable<BonificacionInterface | undefined> {
    const item = this.list.find(x => x.id === id);
    return of(item ? JSON.parse(JSON.stringify(item)) : undefined).pipe(delay(200));
  }

  save(item: BonificacionInterface): Observable<BonificacionInterface> {
    const dup = this.list.find(x =>
      x.categoriaId === item.categoriaId &&
      x.obraSocialId === item.obraSocialId &&
      x.planId === item.planId &&
      x.ubicacionId === item.ubicacionId &&
      x.farmaciaOsConvenioId === item.farmaciaOsConvenioId &&
      x.id !== item.id &&
      x.activo !== false
    );

    if (dup) {
      return throwError(() => new Error('Ya existe una Bonificación configurada para esta combinación.'));
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    const usuarioActual = 'ADMIN_SISTEMA';

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(200));
      }
    }

    const newItem: BonificacionInterface = {
      ...item,
      id: Date.now(),
      codigo: 'BON-' + String(this.list.length + 1).padStart(3, '0'),
      fechaAlta: fechaActual,
      usuarioAlta: usuarioActual,
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

  obtenerBonificacionParaReceta(req: BonificacionConsultaRecetaRequestDto): Observable<BonificacionConsultaRecetaResponseDto> {
    const match = this.list.find(x =>
      x.categoriaId === req.categoriaId &&
      x.obraSocialId === req.obraSocialId &&
      x.planId === req.planId &&
      x.ubicacionId === req.ubicacionId &&
      x.farmaciaId === req.farmaciaId &&
      x.activo === true
    );

    if (match) {
      return of({
        encontrado: true,
        valor1: match.valor1,
        valor2: match.valor2,
        bonificacionId: match.id,
        mensaje: 'Bonificación encontrada exitosamente'
      });
    }

    return of({
      encontrado: false,
      valor1: 0,
      valor2: 0,
      mensaje: 'No se encontró configuración de bonificación para esta combinación'
    });
  }

  exportarExcel(data: BonificacionInterface[]): void {
    let csv = '\uFEFFPLAN;UBICA;CATEGO;CODFAROS;VALOR1;VALOR2\r\n';
    
    data.forEach(row => {
      let categoCode = 'E';
      if (row.categoriaId === 2) categoCode = 'G';
      else if (row.categoriaId === 3) categoCode = 'H';
      else if (row.categoriaNombre?.includes('GENÉRICO') || row.categoriaNombre?.includes('G')) categoCode = 'G';
      else if (row.categoriaNombre?.includes('HOSPITALARIO') || row.categoriaNombre?.includes('H')) categoCode = 'H';

      const planIdNum = row.planId;
      const ubicaIdNum = row.ubicacionId;
      const codFarOs = row.codigoFarmaciaOs || '';
      const v1 = row.valor1.toFixed(2).replace('.', ',');
      const v2 = row.valor2.toFixed(2).replace('.', ',');

      csv += `${planIdNum};${ubicaIdNum};${categoCode};${codFarOs};${v1};${v2}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Bonificaciones_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
