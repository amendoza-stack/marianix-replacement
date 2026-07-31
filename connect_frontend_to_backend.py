import os

# 1. ACTUALIZAR SERVICIO DE BONIFICACIONES EN ANGULAR PARA HTTP REAL
frontend_dir = r"C:\Users\aname\marianix-replacement\frontend"
bonif_service_path = os.path.join(frontend_dir, "src", "app", "modules", "bonificaciones", "services", "bonificaciones.service.ts")

bonif_service_code = """import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  BonificacionInterface, 
  BonificacionConsultaRecetaRequestDto, 
  BonificacionConsultaRecetaResponseDto 
} from '../models/bonificacion.model';

@Injectable({ providedIn: 'root' })
export class BonificacionesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/bonificaciones';

  getAll(): Observable<BonificacionInterface[]> {
    return this.http.get<BonificacionInterface[]>(this.baseUrl);
  }

  getById(id: number): Observable<BonificacionInterface> {
    return this.http.get<BonificacionInterface>(`${this.baseUrl}/${id}`);
  }

  save(item: BonificacionInterface): Observable<BonificacionInterface> {
    if (item.id) {
      return this.http.put<BonificacionInterface>(`${this.baseUrl}/${item.id}`, item);
    }
    return this.http.post<BonificacionInterface>(this.baseUrl, item);
  }

  deleteLogico(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  obtenerBonificacionParaReceta(req: BonificacionConsultaRecetaRequestDto): Observable<BonificacionConsultaRecetaResponseDto> {
    return this.http.post<BonificacionConsultaRecetaResponseDto>(`${this.baseUrl}/consulta-receta`, req);
  }

  exportarExcel(data: BonificacionInterface[]): void {
    let csv = '\\uFEFFPLAN;UBICA;CATEGO;CODFAROS;VALOR1;VALOR2\\r\\n';
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

      csv += `${planIdNum};${ubicaIdNum};${categoCode};${codFarOs};${v1};${v2}\\r\\n`;
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
"""
with open(bonif_service_path, "w", encoding="utf-8") as f:
    f.write(bonif_service_code)

# 2. ACTUALIZAR SERVICIO DE OBRAS SOCIALES EN ANGULAR PARA HTTP REAL
os_service_path = os.path.join(frontend_dir, "src", "app", "modules", "gestion-salud", "obras-sociales", "services", "obras-sociales.service.ts")

os_service_code = """import { Injectable, inject } from '@angular/core';
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
"""
with open(os_service_path, "w", encoding="utf-8") as f:
    f.write(os_service_code)

print("✅ Servicios de Angular conectados mediante Peticiones HTTP reales hacia el Backend FastAPI.")
