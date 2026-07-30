import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AfiliadoInterface, AfiliadoMapper } from '../models/afiliado.model';

@Injectable({ providedIn: 'root' })
export class AfiliadosService {
  private list: AfiliadoInterface[] = [
    { id: 1, codigo: 'AFI-001', apellido: 'PÉREZ', nombre: 'JUAN CARLOS', obraSocialId: 1, obraSocialNombre: 'PAMI INSSJP', numeroAfiliado: '15029384901', estado: 'Activo', dni: '28493021', cuil: '20284930218', vinculoId: 1, vinculoNombre: 'TITULAR', sexo: 'Masculino', fechaNacimiento: '1981-05-14', edad: 45, tipoBeneficiario: 'Titular', observaciones: 'AFILIADO REGULAR CON COBERTURA 100%' },
    { id: 2, codigo: 'AFI-002', apellido: 'GÓMEZ', nombre: 'MARÍA ELENA', obraSocialId: 2, obraSocialNombre: 'IOMA', numeroAfiliado: '9403281002', estado: 'Activo', dni: '31029384', cuil: '27310293844', vinculoId: 2, vinculoNombre: 'CÓNYUGE', sexo: 'Femenino', fechaNacimiento: '1985-09-22', edad: 40, tipoBeneficiario: 'Cónyuge', observaciones: 'PLAN MATERNO INFANTIL' },
    { id: 3, codigo: 'AFI-003', apellido: 'RODRÍGUEZ', nombre: 'ESTEBAN', obraSocialId: 3, obraSocialNombre: 'OSDE', numeroAfiliado: '31002938101', estado: 'Inactivo', dni: '22940321', cuil: '20229403219', vinculoId: 1, vinculoNombre: 'TITULAR', sexo: 'Masculino', fechaNacimiento: '1972-12-03', edad: 53, tipoBeneficiario: 'Titular', observaciones: 'BAJA TEMPORAL POR TRASPASO' }
  ];

  getAll(): Observable<AfiliadoInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(300));
  }

  save(item: AfiliadoInterface): Observable<AfiliadoInterface> {
    const dupDni = this.list.find(x => x.dni === item.dni && x.id !== item.id);
    if (dupDni) return throwError(() => new Error(`Ya existe un afiliado registrado con el DNI ${item.dni}`));

    const dupCuil = this.list.find(x => x.cuil === item.cuil && x.id !== item.id);
    if (dupCuil) return throwError(() => new Error(`Ya existe un afiliado registrado con el CUIL ${item.cuil}`));

    const dupAfiliadoOS = this.list.find(x => x.obraSocialId === item.obraSocialId && x.numeroAfiliado === item.numeroAfiliado && x.id !== item.id);
    if (dupAfiliadoOS) return throwError(() => new Error(`El N° de Afiliado ${item.numeroAfiliado} ya existe para esta Obra Social.`));

    item.apellido = AfiliadoMapper.normalizeText(item.apellido);
    item.nombre = AfiliadoMapper.normalizeText(item.nombre);
    item.edad = AfiliadoMapper.calcularEdad(item.fechaNacimiento);

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(300));
      }
    }

    const nextId = this.list.length + 1;
    const newItem: AfiliadoInterface = {
      ...item,
      id: Date.now(),
      codigo: 'AFI-' + String(nextId).padStart(3, '0'),
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
export class AfiliadosFacade {
  private service = inject(AfiliadosService);
  afiliados = signal<AfiliadoInterface[]>([]);
  isLoading = signal<boolean>(false);

  loadAll(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data: AfiliadoInterface[]) => {
        this.afiliados.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
