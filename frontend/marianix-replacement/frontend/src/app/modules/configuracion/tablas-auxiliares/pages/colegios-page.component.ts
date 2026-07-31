import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-colegios-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="colegios" entityTitle="Colegio Farmacéutico"></app-crud-base-tabla-auxiliar>`
})
export class ColegiosPageComponent {}
