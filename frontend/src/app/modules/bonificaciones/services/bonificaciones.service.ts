import { Injectable, inject } from '@angular/core';
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
