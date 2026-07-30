import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-provincias-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="provincias" entityTitle="Provincia"></app-crud-base-tabla-auxiliar>`
})
export class ProvinciasPageComponent {}
