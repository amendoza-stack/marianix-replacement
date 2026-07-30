import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValidacionArchivoResultadoDto, HistorialImportacionInterface } from '../models/importacion-novedades.model';

@Injectable({ providedIn: 'root' })
export class ImportacionNovedadesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/medicamentos/importacion';

  validarArchivo(file: File): Observable<ValidacionArchivoResultadoDto> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<ValidacionArchivoResultadoDto>(`${this.baseUrl}/validar`, formData);
  }

  procesarImportacion(file: File): Observable<HistorialImportacionInterface> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<HistorialImportacionInterface>(`${this.baseUrl}/procesar`, formData);
  }

  getHistorial(): Observable<HistorialImportacionInterface[]> {
    return this.http.get<HistorialImportacionInterface[]>(`${this.baseUrl}/historial`);
  }

  exportarErroresCsv(items: any[]): void {
    const errores = items.filter(x => x.estadoFila === 'Error' || x.mensajesValidacion?.length > 0);
    let csvContent = 'data:text/csv;charset=utf-8,Linea;Codigo;Descripcion;Errores\n';
    errores.forEach(row => {
      const msgs = (row.mensajesValidacion || []).join(' | ');
      csvContent += `${row.lineaIndex};${row.codigo || ''};"${row.descripcion || ''}";"${msgs}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Errores_Importacion_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
