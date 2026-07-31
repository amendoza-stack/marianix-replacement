import { Component } from '@angular/core';
import { CrudBaseComponent } from '../components/crud-base.component';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [CrudBaseComponent],
  template: `<app-crud-base-tabla-auxiliar entityKey="categorias" entityTitle="Categoría Medicamento"></app-crud-base-tabla-auxiliar>`
})
export class CategoriasPageComponent {}
