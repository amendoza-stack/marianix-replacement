import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-ubicaciones-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="ubicaciones" entityTitle="Ubicación"></app-crud-base-tabla-auxiliar>`
})
export class UbicacionesPageComponent {}
