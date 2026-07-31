import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FarmaciaInterface, FarmaciaConvenioObraSocialInterface } from '../models/farmacia.model';

@Injectable({ providedIn: 'root' })
export class FarmaciasService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/salud/farmacias';

  private list: FarmaciaInterface[] = [
    {
      id: 1,
      codigo: '1',
      descripcion: 'FARMACIA CENTRAL BUENOS AIRES',
      paisId: 1, paisNombre: 'ARGENTINA',
      provinciaId: 1, provinciaNombre: 'BUENOS AIRES',
      localidad: 'PALERMO', ciudad: 'CABA', direccion: 'AV. SANTA FE', numero: '3200',
      codigoPostal: '1425', telefonos: '011-4800-1122', pami: 'PAM-9481', contactos: 'JUAN PEREZ',
      mail: 'contacto@farmaciacentral.com.ar', ubicacionId: 1, ubicacionNombre: 'CENTRO METROPOLITANO',
      zonaId: 1, zonaNombre: 'ZONA NORTE', responsableDT: 'DRA. MARÍA GONZÁLEZ (MN 49201)',
      cuit: '30-71234567-8', banco: 'BANCO NACIÓN', cuentaBancaria: 'CC-948201/2',
      titularCuenta: 'FARMACIA CENTRAL S.A.', cbu: '0110599520000001234567', fechaAlta: '2026-01-15',
      modificarBonificacion: 'Sí', drogueriaId: 1, drogueriaNombre: 'DROGUERÍA MONROE',
      estadoLegal: 'HABILITACIÓN ANMAT VIGENTE N° 4920/26', observaciones: 'SUCURSAL CABECERA',
      cuf: 'CUF-100294', activo: true
    },
    {
      id: 2,
      codigo: '2',
      descripcion: 'FARMACIA DEL SOL',
      paisId: 1, paisNombre: 'ARGENTINA',
      provinciaId: 2, provinciaNombre: 'CÓRDOBA',
      localidad: 'NUEVA CÓRDOBA', ciudad: 'CÓRDOBA', direccion: 'AV. VÉLEZ SARSFIELD', numero: '850',
      codigoPostal: '5000', telefonos: '0351-422-9988', pami: 'PAM-3321', contactos: 'CARLOS GOMEZ',
      mail: 'ventas@farmaciadelsol.com', ubicacionId: 2, ubicacionNombre: 'SUCURSAL CÓRDOBA',
      zonaId: 2, zonaNombre: 'ZONA CENTRO', responsableDT: 'DR. ROBERTO SANCHEZ (MN 12093)',
      cuit: '30-68994021-4', banco: 'BANCO CÓRDOBA', cuentaBancaria: 'CC-339201/1',
      titularCuenta: 'FARMACIA DEL SOL SRL', cbu: '0200334110000009876543', fechaAlta: '2026-02-01',
      modificarBonificacion: 'No', drogueriaId: 2, drogueriaNombre: 'DROGUERÍA DEL SUD',
      estadoLegal: 'HABILITACIÓN MINSALUD CÓRDOBA VIGENTE', observaciones: 'ATENCIÓN 24 HS',
      cuf: 'CUF-300192', activo: true
    }
  ];

  getAll(search?: string): Observable<FarmaciaInterface[]> {
    return of(JSON.parse(JSON.stringify(this.list))).pipe(delay(200));
  }

  getById(id: number): Observable<FarmaciaInterface | undefined> {
    const item = this.list.find(x => x.id === id);
    return of(item ? JSON.parse(JSON.stringify(item)) : undefined).pipe(delay(200));
  }

  save(item: FarmaciaInterface): Observable<FarmaciaInterface> {
    item.descripcion = item.descripcion.trim().toUpperCase();
    item.cuit = item.cuit.trim();
    item.cuf = item.cuf.trim().toUpperCase();

    if (item.id) {
      const idx = this.list.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        this.list[idx] = { ...this.list[idx], ...item };
        return of(this.list[idx]).pipe(delay(200));
      }
    }

    const newItem: FarmaciaInterface = {
      ...item,
      id: Date.now(),
      codigo: String(this.list.length + 1),
      fechaAlta: new Date().toISOString().split('T')[0]
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
}
