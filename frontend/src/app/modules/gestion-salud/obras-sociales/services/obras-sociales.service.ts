import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // OBRAS SOCIALES
  getAllObraSociales(): Observable<ObraSocialInterface[]> {
    return this.http.get<ObraSocialInterface[]>(this.baseUrl);
  }

  saveObraSocial(item: ObraSocialInterface): Observable<ObraSocialInterface> {
    if (item.id) {
      return this.http.put<ObraSocialInterface>(`${this.baseUrl}/${item.id}`, item);
    }
    return this.http.post<ObraSocialInterface>(this.baseUrl, item);
  }

  // PLANES
  getPlanesByObraSocial(obraSocialId: number): Observable<PlanCoberturaInterface[]> {
    return this.http.get<PlanCoberturaInterface[]>(`${this.baseUrl}/${obraSocialId}/planes`);
  }

  savePlan(item: PlanCoberturaInterface): Observable<PlanCoberturaInterface> {
    if (item.id) {
      return this.http.put<PlanCoberturaInterface>(`${this.baseUrl}/planes/${item.id}`, item);
    }
    return this.http.post<PlanCoberturaInterface>(`${this.baseUrl}/${item.obraSocialId}/planes`, item);
  }

  deletePlan(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/planes/${id}`);
  }

  // FARMACIAS OS
  getFarmaciasOsByObraSocial(obraSocialId: number): Observable<FarmaciaOsInterface[]> {
    return this.http.get<FarmaciaOsInterface[]>(`${this.baseUrl}/${obraSocialId}/farmacias`);
  }

  saveFarmaciaOs(item: FarmaciaOsInterface): Observable<FarmaciaOsInterface> {
    if (item.id) {
      return this.http.put<FarmaciaOsInterface>(`${this.baseUrl}/farmacias/${item.id}`, item);
    }
    return this.http.post<FarmaciaOsInterface>(`${this.baseUrl}/${item.obraSocialId}/farmacias`, item);
  }

  deleteFarmaciaOs(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/farmacias/${id}`);
  }

  // PLAN MONODROGA
  getPlanMonodrogasByObraSocial(obraSocialId: number): Observable<PlanMonodrogaInterface[]> {
    return this.http.get<PlanMonodrogaInterface[]>(`${this.baseUrl}/${obraSocialId}/plan-monodrogas`);
  }

  savePlanMonodroga(item: PlanMonodrogaInterface): Observable<PlanMonodrogaInterface> {
    if (item.id) {
      return this.http.put<PlanMonodrogaInterface>(`${this.baseUrl}/plan-monodrogas/${item.id}`, item);
    }
    return this.http.post<PlanMonodrogaInterface>(`${this.baseUrl}/${item.obraSocialId}/plan-monodrogas`, item);
  }

  deletePlanMonodroga(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/plan-monodrogas/${id}`);
  }
}
