import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-paises-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="paises" entityTitle="País"></app-crud-base-tabla-auxiliar>`
})
export class PaisesPageComponent {}
