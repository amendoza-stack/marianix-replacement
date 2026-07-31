import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-zonas-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="zonas" entityTitle="Zona"></app-crud-base-tabla-auxiliar>`
})
export class ZonasPageComponent {}
