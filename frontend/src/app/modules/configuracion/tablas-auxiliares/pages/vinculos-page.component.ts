import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-vinculos-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="vinculos" entityTitle="Vínculo"></app-crud-base-tabla-auxiliar>`
})
export class VinculosPageComponent {}
