import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-observaciones-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="observaciones" entityTitle="Observación"></app-crud-base-tabla-auxiliar>`
})
export class ObservacionesPageComponent {}
