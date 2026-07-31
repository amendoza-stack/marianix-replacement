import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ObraSocialInterface, LaboratorioInterface } from '../models/gestion-salud.model';

@Injectable({ providedIn: 'root' })
export class ObrasSocialesService {
  private osList: ObraSocialInterface[] = [
    {
      id: 1, codigo: 'OS-001', razonSocial: 'PROGRAMA DE ATENCIÓN MÉDICA INTEGRAL', sigla: 'PAMI INSSJP', cuit: '30546670891', estado: 'Activa', telefono: '0800-222-7264', email: 'contacto@pami.org.ar',
      planes: [
        { id: 101, codigo: 'PL-PAMI-AMB', nombrePlan: 'AMBULATORIO GENERAL', coberturaPorcentaje: 80, copagoFijo: 0, activo: true },
        { id: 102, codigo: 'PL-PAMI-ONCO', nombrePlan: 'ONCOLÓGICO ESPECIAL', coberturaPorcentaje: 100, copagoFijo: 0, activo: true }
      ],
      farmacias: [
        { id: 201, cuit: '30710293841', razonSocial: 'FARMACIA CENTRAL QUILMES', direccion: 'PEATONAL RIVADAVIA 240', localidad: 'QUILMES', activa: true },
        { id: 202, cuit: '30592039182', razonSocial: 'FARMACIA BELGRANO CABA', direccion: 'AV. CABILDO 1820', localidad: 'CABA', activa: true }
      ],
      monodrogas: [
        { id: 301, monodrogaNombre: 'AMOXICILINA 500MG', planNombre: 'AMBULATORIO GENERAL', coberturaEspecial: 80, requiereAuditoria: false },
        { id: 302, monodrogaNombre: 'LOSARTÁN 50MG', planNombre: 'AMBULATORIO GENERAL', coberturaEspecial: 100, requiereAuditoria: false }
      ]
    },
    {
      id: 2, codigo: 'OS-002', razonSocial: 'INSTITUTO DE OBRA MÉDICO ASISTENCIAL', sigla: 'IOMA', cuit: '30649201924', estado: 'Activa', telefono: '0810-999-4662', email: 'autorizaciones@ioma.gba.gob.ar',
      planes: [
        { id: 103, codigo: 'PL-IOMA-TRAD', nombrePlan: 'TRADICIONAL OBLIGATORIO', coberturaPorcentaje: 70, copagoFijo: 500, activo: true }
      ],
      farmacias: [],
      monodrogas: []
    }
  ];

  private labList: LaboratorioInterface[] = [
    { id: 1, codigo: 'LAB-001', razonSocial: 'LABORATORIOS BAGO S.A.', cuit: '30500921092', estado: 'Activo', telefono: '011-4340-0000', contacto: 'LIC. JUAN PÉREZ' },
    { id: 2, codigo: 'LAB-002', razonSocial: 'ROEMMERS S.A.I.C.F.', cuit: '30500192831', estado: 'Activo', telefono: '011-4349-1100', contacto: 'DRA. MARÍA GONZÁLEZ' }
  ];

  getObrasSociales(): Observable<ObraSocialInterface[]> {
    return of(JSON.parse(JSON.stringify(this.osList))).pipe(delay(300));
  }

  saveObraSocial(item: ObraSocialInterface): Observable<ObraSocialInterface> {
    if (item.id) {
      const idx = this.osList.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.osList[idx] = { ...this.osList[idx], ...item };
        return of(this.osList[idx]).pipe(delay(300));
      }
    }
    const newItem: ObraSocialInterface = {
      ...item,
      id: Date.now(),
      codigo: 'OS-' + String(this.osList.length + 1).padStart(3, '0'),
      planes: [], farmacias: [], monodrogas: []
    };
    this.osList.unshift(newItem);
    return of(newItem).pipe(delay(300));
  }

  getLaboratorios(): Observable<LaboratorioInterface[]> {
    return of(JSON.parse(JSON.stringify(this.labList))).pipe(delay(300));
  }
}
