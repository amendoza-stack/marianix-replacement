import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  PaisItem, ProvinciaItem, UbicacionItem, ZonaItem,
  ColegioFarmaceuticoItem, CategoriaMedicamentoItem, TipoPatologiaItem,
  EspecialidadMedicaItem, ObservacionItem, VinculoItem, PeriodoItem, DrogueriaItem
} from '../models/tablas-auxiliares.model';

@Injectable({ providedIn: 'root' })
export class TablasAuxiliaresService {

  // MEMORIA DE PAÍSES (FASE 1)
  private paises: PaisItem[] = [
    { id: 1, codigo: 'ARG', descripcion: 'ARGENTINA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'BRA', descripcion: 'BRASIL', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'URY', descripcion: 'URUGUAY', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'CHL', descripcion: 'CHILE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 5, codigo: 'PRY', descripcion: 'PARAGUAY', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE PROVINCIAS (FASE 2)
  private provincias: ProvinciaItem[] = [
    { id: 1, codigo: 'CABA', paisId: 1, paisNombre: 'ARGENTINA', descripcion: 'CIUDAD AUTÓNOMA DE BUENOS AIRES', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'PBA', paisId: 1, paisNombre: 'ARGENTINA', descripcion: 'BUENOS AIRES', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'CBA', paisId: 1, paisNombre: 'ARGENTINA', descripcion: 'CÓRDOBA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'SF', paisId: 1, paisNombre: 'ARGENTINA', descripcion: 'SANTA FE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 5, codigo: 'MZA', paisId: 1, paisNombre: 'ARGENTINA', descripcion: 'MENDOZA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE UBICACIONES (FASE 3)
  private ubicaciones: UbicacionItem[] = [
    { id: 1, codigo: 'CABA', descripcion: 'CABA', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 2, codigo: 'PBA', descripcion: 'BUENOS AIRES', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 3, codigo: 'INT', descripcion: 'INTERIOR', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' }
  ];

  // MEMORIA DE ZONAS (FASE 4)
  private zonas: ZonaItem[] = [
    { id: 1, codigo: 'ZN-NORTE', descripcion: 'ZONA SANITARIA NORTE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'ZN-SUR', descripcion: 'ZONA SANITARIA SUR', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'ZN-OESTE', descripcion: 'ZONA SANITARIA OESTE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'ZN-CENTRO', descripcion: 'ZONA SANITARIA CENTRO', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE COLEGIOS FARMACÉUTICOS (FASE 5)
  private colegios: ColegioFarmaceuticoItem[] = [
    { id: 1, codigo: 'CFPBA', descripcion: 'COLEGIO DE FARMACÉUTICOS DE PROVINCIA DE BUENOS AIRES', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'COFCABA', descripcion: 'COLEGIO OFICIAL DE FARMACÉUTICOS Y BIOQUÍMICOS DE CABA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'CFC', descripcion: 'COLEGIO DE FARMACÉUTICOS DE CÓRDOBA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE CATEGORÍAS MEDICAMENTOS (FASE 6)
  private categorias: CategoriaMedicamentoItem[] = [
    { id: 1, codigo: 'E', descripcion: 'ÉTICO', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 2, codigo: 'G', descripcion: 'GENÉRICO', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 3, codigo: 'H', descripcion: 'HOSPITALARIO', activo: true, esProtegido: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' }
  ];

  // MEMORIA DE TIPOS PATOLOGÍAS (FASE 7)
  private patologias: TipoPatologiaItem[] = [
    { id: 1, codigo: 'CRONICA', descripcion: 'PATOLOGÍA CRÓNICA DE ALTO COSTO', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'AGUDA', descripcion: 'PATOLOGÍA AGUDA AMBULATORIA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'ONCO', descripcion: 'ONCOLÓGICA Y ESPECIAL', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'DIAB', descripcion: 'DIABETES Y METABÓLICA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE ESPECIALIDADES MÉDICAS (FASE 8)
  private especialidades: EspecialidadMedicaItem[] = [
    { id: 1, codigo: 'CLIN', descripcion: 'CLÍNICA MÉDICA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'PEDI', descripcion: 'PEDIATRÍA Y PUERICULTURA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'CARD', descripcion: 'CARDIOLOGÍA INTERVENCIONISTA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'GINE', descripcion: 'GINECOLOGÍA Y OBSTETRICIA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 5, codigo: 'TRAU', descripcion: 'TRAUMATOLOGÍA Y ORTOPEDIA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE OBSERVACIONES (FASE 9)
  private observaciones: ObservacionItem[] = [
    { id: 1, codigo: 'OBS-01', descripcion: 'RECETA AUDITADA CORRECTAMENTE CON VADEMÉCUM VIGENTE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'OBS-02', descripcion: 'REQUIERE AUTORIZACIÓN ESPECIAL DE DIRECCIÓN MÉDICA', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'OBS-03', descripcion: 'TOPE MENSUAL DE MONODROGA EXCEDIDO SEGÚN HISTORIAL', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE VÍNCULOS (FASE 10)
  private vinculos: VinculoItem[] = [
    { id: 1, codigo: 'TIT', descripcion: 'TITULAR', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 2, codigo: 'CON', descripcion: 'CÓNYUGE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 3, codigo: 'HIJ', descripcion: 'HIJO', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 4, codigo: 'MAD', descripcion: 'MADRE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 5, codigo: 'PAD', descripcion: 'PADRE', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' },
    { id: 6, codigo: 'OTR', descripcion: 'OTRO', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'SYSTEM' }
  ];

  // MEMORIA DE PERÍODOS (FASE 11)
  private periodos: PeriodoItem[] = [
    { id: 1, codigo: '202607', descripcion: 'JULIO DE 2026', fechaDesde: '2026-07-01', fechaHasta: '2026-07-31', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: '202608', descripcion: 'AGOSTO DE 2026', fechaDesde: '2026-08-01', fechaHasta: '2026-08-31', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: '202609', descripcion: 'SEPTIEMBRE DE 2026', fechaDesde: '2026-09-01', fechaHasta: '2026-09-30', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MEMORIA DE DROGUERÍAS (FASE 12)
  private droguerias: DrogueriaItem[] = [
    { id: 1, codigo: 'DROG-MON', descripcion: 'DROGUERÍA MONROE CENTRAL S.A.', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 2, codigo: 'DROG-SUI', descripcion: 'DROGUERÍA SUIZO ARGENTINA S.A.', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 3, codigo: 'DROG-DEL', descripcion: 'DROGUERÍA DEL SUD S.A.', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' },
    { id: 4, codigo: 'DROG-DIS', descripcion: 'DISTRIBUIDORA FARMACÉUTICA KELSEY', activo: true, fechaAlta: '2026-01-01', usuarioAlta: 'anamendoza' }
  ];

  // MÉTODOS GENÉRICOS DE CONSULTA Y EDICIÓN
  getAll<T>(entityKey: string): Observable<T[]> {
    const data = (this as any)[entityKey] || [];
    return of(JSON.parse(JSON.stringify(data))).pipe(delay(300));
  }

  save<T extends { id?: number; codigo: string; descripcion: string }>(entityKey: string, item: T): Observable<T> {
    const list = (this as any)[entityKey] as any[];
    if (item.id) {
      const idx = list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item, fechaModificacion: new Date().toISOString().split('T')[0], usuarioModificacion: 'anamendoza' };
        return of(list[idx]).pipe(delay(300));
      }
    }
    const newObj = {
      ...item,
      id: Date.now(),
      fechaAlta: new Date().toISOString().split('T')[0],
      usuarioAlta: 'anamendoza'
    };
    list.unshift(newObj);
    return of(newObj as T).pipe(delay(300));
  }

  delete(entityKey: string, id: number): Observable<boolean> {
    const list = (this as any)[entityKey] as any[];
    const item = list.find(x => x.id === id);
    if (item && item.esProtegido) {
      return throwError(() => new Error('Este registro está protegido por el sistema y no puede ser eliminado.'));
    }
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }
}
