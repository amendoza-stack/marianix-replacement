import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RolesPageFormComponent } from './roles-page-form.component';
import { RolItem } from './roles.model';

@Component({
  selector: 'app-roles-page-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    MatTableModule,
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './roles-page-list.component.html'
})
export class RolesPageListComponent implements OnInit {
  roles: RolItem[] = [];
  dataSource = new MatTableDataSource<RolItem>([]);
  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'acciones'];
  searchTerm: string = '';

  private apiUrl = 'http://127.0.0.1:8000/api/v1/seguridad/roles';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.http.get<RolItem[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.roles = data;
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  applyFilter(): void {
    const txt = this.searchTerm.toLowerCase().trim();
    this.dataSource.data = this.roles.filter(r => 
      (r.codigo && r.codigo.toLowerCase().includes(txt)) ||
      (r.nombre && r.nombre.toLowerCase().includes(txt)) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(txt))
    );
  }

  openForm(rol?: RolItem): void {
    const dialogRef = this.dialog.open(RolesPageFormComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: rol ? { ...rol } : null
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res.id) {
          this.http.put(`${this.apiUrl}/${res.id}`, res).subscribe({
            next: () => this.cargarRoles(),
            error: (err) => console.error('Error al actualizar rol:', err)
          });
        } else {
          this.http.post(this.apiUrl, res).subscribe({
            next: () => this.cargarRoles(),
            error: (err) => console.error('Error al crear rol:', err)
          });
        }
      }
    });
  }

  deleteRole(rol: RolItem): void {
    if (rol.esSistema) {
      alert('Los roles de sistema protegidos (SUPERADMIN, AUDITOR) no pueden eliminarse.');
      return;
    }
    if (confirm(`¿Está seguro de eliminar el rol ${rol.nombre}?`)) {
      this.http.delete(`${this.apiUrl}/${rol.id}`).subscribe({
        next: () => this.cargarRoles(),
        error: (err) => console.error('Error al eliminar rol:', err)
      });
    }
  }
}