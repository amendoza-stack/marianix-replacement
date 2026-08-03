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
import { UsuariosPageFormComponent } from './usuarios-page-form.component';

export interface Usuario {
  id?: number;
  codigo?: string;
  username?: string;
  nombre: string;
  nombre_completo?: string;
  email: string;
  roles?: string[];
  activo?: boolean;
}

@Component({
  selector: 'app-usuarios-page-list',
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
  templateUrl: './usuarios-page-list.component.html'
})
export class UsuariosPageListComponent implements OnInit {
  usuarios: Usuario[] = [];
  dataSource = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = ['codigo', 'nombre', 'roles', 'activo', 'acciones'];
  filtroTexto: string = '';

  private apiUrl = 'http://127.0.0.1:8000/api/v1/seguridad/usuarios';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.http.get<Usuario[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.dataSource.data = data;
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  applyFilter(): void {
    const txt = this.filtroTexto.toLowerCase().trim();
    this.dataSource.data = this.usuarios.filter(u => 
      (u.nombre && u.nombre.toLowerCase().includes(txt)) ||
      (u.username && u.username.toLowerCase().includes(txt)) ||
      (u.email && u.email.toLowerCase().includes(txt))
    );
  }

  openForm(u?: Usuario): void {
    const dialogRef = this.dialog.open(UsuariosPageFormComponent, {
      width: '500px',
      data: u ? { ...u } : null
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res.id) {
          // Editar
          this.http.put(`${this.apiUrl}/${res.id}`, res).subscribe({
            next: () => this.cargarUsuarios(),
            error: (err) => console.error('Error al actualizar usuario:', err)
          });
        } else {
          // Crear
          this.http.post(this.apiUrl, res).subscribe({
            next: () => this.cargarUsuarios(),
            error: (err) => console.error('Error al crear usuario:', err)
          });
        }
      }
    });
  }

  eliminarUsuario(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar este usuario de la Base de Datos?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err) => console.error('Error al eliminar usuario:', err)
      });
    }
  }
}