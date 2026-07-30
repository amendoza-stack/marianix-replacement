import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-periodos-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="periodos" entityTitle="Período"></app-crud-base-tabla-auxiliar>`
})
export class PeriodosPageComponent {}
