import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-especialidades-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="especialidades" entityTitle="Especialidad Médica"></app-crud-base-tabla-auxiliar>`
})
export class EspecialidadesPageComponent {}
