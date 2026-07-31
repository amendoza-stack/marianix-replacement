import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-patologias-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="patologias" entityTitle="Tipo de Patología"></app-crud-base-tabla-auxiliar>`
})
export class PatologiasPageComponent {}
