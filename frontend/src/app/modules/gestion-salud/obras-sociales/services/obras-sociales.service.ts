import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  ObraSocialInterface, 
  PlanCoberturaInterface, 
  FarmaciaOsInterface, 
  PlanMonodrogaInterface 
} from '../models/obra-social.model';

@Injectable({ providedIn: 'root' })
export class ObrasSocialesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/salud/obras-sociales';

  private obrasSociales: ObraSocialInterface[] = [
    {
      id: 1,
      codigo: 'OS-001',
      descripcion: 'OSDE ORGANIZACIÓN DE SERVICIOS DIRECTOS EMPRESARIOS',
      sigla: 'OSDE',
      cuit: '30-54674125-9',
      activo: true
    },
    {
      id: 2,
      codigo: 'OS-002',
      descripcion: 'SWISS MEDICAL S.A.',
      sigla: 'SMG',
      cuit: '30-65432109-8',
      activo: true
    }
  ];

  private planes: PlanCoberturaInterface[] = [
    { id: 1, obraSocialId: 1, codigo: 'PLN-001', descripcion: 'PLAN 210', porcentajeCobertura: 40, copagoFijo: 0, codigoSSS: 'SSS-210', activo: true },
    { id: 2, obraSocialId: 1, codigo: 'PLN-002', descripcion: 'PLAN 310', porcentajeCobertura: 50, copagoFijo: 0, codigoSSS: 'SSS-310', activo: true },
    { id: 3, obraSocialId: 2, codigo: 'PLN-003', descripcion: 'PLAN SMG20', porcentajeCobertura: 40, copagoFijo: 500, codigoSSS: 'SSS-SMG20', activo: true }
  ];

  private farmaciasOs: FarmaciaOsInterface[] = [
    { id: 101, obraSocialId: 1, codigoFarmaciaOs: '102', farmaciaId: 1, farmaciaCodigoInterno: 'FAR-001', farmaciaRazonSocial: 'FARMACIA CENTRAL BUENOS AIRES', farmaciaCuit: '30-71234567-8', activo: true },
    { id: 102, obraSocialId: 1, codigoFarmaciaOs: '205', farmaciaId: 2, farmaciaCodigoInterno: 'FAR-002', farmaciaRazonSocial: 'FARMACIA DEL SOL', farmaciaCuit: '30-68994021-4', activo: true }
  ];

  private planMonodrogas: PlanMonodrogaInterface[] = [
    { id: 1, obraSocialId: 1, planId: 1, planDescripcion: 'PLAN 210', monodrogaId: 1, monodrogaNombre: 'IBUPROFENO', laboratorioId: 1, laboratorioNombre: 'LABORATORIOS BAYER', activo: true },
    { id: 2, obraSocialId: 1, planId: 1, planDescripcion: 'PLAN 210', monodrogaId: 2, monodrogaNombre: 'PARACETAMOL', laboratorioId: 2, laboratorioNombre: 'ROEMMERS', activo: true }
  ];

  // OBRA SOCIAL MAESTRO
  getAllObraSociales(): Observable<ObraSocialInterface[]> {
    return of(JSON.parse(JSON.stringify(this.obrasSociales.filter(x => x.activo !== false)))).pipe(delay(200));
  }

  // PLANES
  getPlanesByObraSocial(obraSocialId: number): Observable<PlanCoberturaInterface[]> {
    const res = this.planes.filter(x => x.obraSocialId === obraSocialId && x.activo !== false);
    return of(JSON.parse(JSON.stringify(res))).pipe(delay(200));
  }

  savePlan(item: PlanCoberturaInterface): Observable<PlanCoberturaInterface> {
    const dup = this.planes.find(x => 
      x.obraSocialId === item.obraSocialId && 
      x.descripcion.trim().toUpperCase() === item.descripcion.trim().toUpperCase() && 
      x.id !== item.id &&
      x.activo !== false
    );
    if (dup) return throwError(() => new Error('No se permite registrar dos planes con la misma descripción en esta Obra Social.'));

    if (item.id) {
      const idx = this.planes.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.planes[idx] = { ...this.planes[idx], ...item };
        return of(this.planes[idx]).pipe(delay(200));
      }
    }
    const newItem = { ...item, id: Date.now(), codigo: 'PLN-' + String(this.planes.length + 1).padStart(3, '0') };
    this.planes.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  deletePlan(id: number): Observable<boolean> {
    const idx = this.planes.findIndex(x => x.id === id);
    if (idx !== -1) { this.planes[idx].activo = false; return of(true).pipe(delay(200)); }
    return of(false);
  }

  // FARMACIAS OS
  getFarmaciasOsByObraSocial(obraSocialId: number): Observable<FarmaciaOsInterface[]> {
    const res = this.farmaciasOs.filter(x => x.obraSocialId === obraSocialId && x.activo !== false);
    return of(JSON.parse(JSON.stringify(res))).pipe(delay(200));
  }

  saveFarmaciaOs(item: FarmaciaOsInterface): Observable<FarmaciaOsInterface> {
    const dupFarmacia = this.farmaciasOs.find(x => x.obraSocialId === item.obraSocialId && x.farmaciaId === item.farmaciaId && x.id !== item.id && x.activo !== false);
    if (dupFarmacia) return throwError(() => new Error('La farmacia ya se encuentra asociada a esta Obra Social.'));

    const dupCod = this.farmaciasOs.find(x => x.obraSocialId === item.obraSocialId && x.codigoFarmaciaOs.trim() === item.codigoFarmaciaOs.trim() && x.id !== item.id && x.activo !== false);
    if (dupCod) return throwError(() => new Error('El Código Farmacia OS ya existe para esta Obra Social.'));

    if (item.id) {
      const idx = this.farmaciasOs.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.farmaciasOs[idx] = { ...this.farmaciasOs[idx], ...item };
        return of(this.farmaciasOs[idx]).pipe(delay(200));
      }
    }
    const newItem = { ...item, id: Date.now() };
    this.farmaciasOs.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  deleteFarmaciaOs(id: number): Observable<boolean> {
    const idx = this.farmaciasOs.findIndex(x => x.id === id);
    if (idx !== -1) { this.farmaciasOs[idx].activo = false; return of(true).pipe(delay(200)); }
    return of(false);
  }

  // PLAN MONODROGA
  getPlanMonodrogasByObraSocial(obraSocialId: number): Observable<PlanMonodrogaInterface[]> {
    const res = this.planMonodrogas.filter(x => x.obraSocialId === obraSocialId && x.activo !== false);
    return of(JSON.parse(JSON.stringify(res))).pipe(delay(200));
  }

  savePlanMonodroga(item: PlanMonodrogaInterface): Observable<PlanMonodrogaInterface> {
    const dup = this.planMonodrogas.find(x => 
      x.obraSocialId === item.obraSocialId && 
      x.planId === item.planId && 
      x.monodrogaId === item.monodrogaId && 
      x.laboratorioId === item.laboratorioId && 
      x.id !== item.id && 
      x.activo !== false
    );
    if (dup) return throwError(() => new Error('Ya existe una regla configurada para la combinación de Plan, Monodroga y Laboratorio.'));

    if (item.id) {
      const idx = this.planMonodrogas.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.planMonodrogas[idx] = { ...this.planMonodrogas[idx], ...item };
        return of(this.planMonodrogas[idx]).pipe(delay(200));
      }
    }
    const newItem = { ...item, id: Date.now() };
    this.planMonodrogas.unshift(newItem);
    return of(newItem).pipe(delay(200));
  }

  deletePlanMonodroga(id: number): Observable<boolean> {
    const idx = this.planMonodrogas.findIndex(x => x.id === id);
    if (idx !== -1) { this.planMonodrogas[idx].activo = false; return of(true).pipe(delay(200)); }
    return of(false);
  }
}
