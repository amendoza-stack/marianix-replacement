import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MedicoInterface, MedicoMapper } from '../models/medico.model';

@Injectable({ providedIn: 'root' })
export class MedicosService {
  private list: MedicoInterface[] = [
    { id: 1, codigo: 'MED-001', apellido: 'MARTÍNEZ', nombre: 'CARLOS ALBERTO', matricula: 'MP-84930', especialidadId: 1, especialidadNombre: 'CLÍNICA MÉDICA', tipoMatricula: 'Provincial', estado: 'Activo', cuit: '20149302918', telefono: '011-4930-2910', mail: 'cmartinez@medicos.org', observaciones: 'ATENCIÓN LUNES Y MIÉRCOLES' },
    { id: 2, codigo: 'MED-002', apellido: 'ALVAREZ', nombre: 'PATRICIA LORENA', matricula: 'MN-112049', especialidadId: 3, especialidadNombre: 'CARDIOLOGÍA INTERVENCIONISTA', tipoMatricula: 'Nacional', estado: 'Activo', cuit: '27220493814', telefono: '011-5839-2019', mail: 'palvarez@cardiologia.ar', observaciones: 'JEFE DE SERVICIO' },
    { id: 3, codigo: 'MED-003', apellido: 'SÁNCHEZ', nombre: 'HERNÁN DARIO', matricula: 'MP-49201', especialidadId: 2, especialidadNombre: 'PEDIATRÍA Y PUERICULTURA', tipoMatricula: 'Provincial', estado: 'Inactivo', cuit: '20281920398', telefono: '0351-4930219', mail: 'hsanchez@pediatria.com', observaciones: 'LICENCIA POR CAPACITACIÓN' }
  ];

  getAll(): Observable<MedicoInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(300));
  }

  save(item: MedicoInterface): Observable<MedicoInterface> {
    const dupMat = this.list.find(x => x.matricula === item.matricula && x.id !== item.id);
    if (dupMat) return throwError(() => new Error(`Ya existe un médico registrado con la Matrícula ${item.matricula}`));

    item.apellido = MedicoMapper.normalizeText(item.apellido);
    item.nombre = MedicoMapper.normalizeText(item.nombre);

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(300));
      }
    }

    const nextId = this.list.length + 1;
    const newItem: MedicoInterface = {
      ...item,
      id: Date.now(),
      codigo: 'MED-' + String(nextId).padStart(3, '0'),
      fechaAlta: new Date().toISOString().split('T')[0],
      usuarioAlta: 'anamendoza'
    };
    this.list.unshift(newItem);
    return of(newItem).pipe(delay(300));
  }

  delete(id: number): Observable<boolean> {
    const idx = this.list.findIndex(x => x.id === id);
    if (idx !== -1) {
      this.list.splice(idx, 1);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }
}

@Injectable({ providedIn: 'root' })
export class MedicosFacade {
  private service = inject(MedicosService);
  medicos = signal<MedicoInterface[]>([]);
  isLoading = signal<boolean>(false);

  loadAll(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data: MedicoInterface[]) => {
        this.medicos.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
