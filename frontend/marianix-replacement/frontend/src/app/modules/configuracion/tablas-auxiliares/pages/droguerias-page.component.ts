import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-droguerias-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="droguerias" entityTitle="Droguería"></app-crud-base-tabla-auxiliar>`
})
export class DrogueriasPageComponent {}
