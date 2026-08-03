import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  id?: number;
  codigo?: string;
  nombre: string;
  email: string;
  roles?: string[];
  activo?: boolean;
}

@Component({
  selector: 'app-usuarios-page-list',
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p class="text-sm text-gray-500">Administración de usuarios, asignación de roles múltiples y claves de acceso</p>
        </div>
        <button 
          (click)="abrirFormulario()" 
          class="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow cursor-pointer">
          + Nuevo Usuario
        </button>
      </div>

      <!-- Modal / Formulario Flotante de Usuario (Bindings nativos sin ngModel) -->
      <div *ngIf="mostrarFormulario" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
          <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
            <h3 class="font-bold text-lg">{{ usuarioEditandoId ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
            <button (click)="cerrarFormulario()" class="text-gray-400 hover:text-white font-bold text-xl">&times;</button>
          </div>

          <form (submit)="guardarUsuario($event)" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo</label>
              <input 
                type="text" 
                [value]="formUsuario.nombre"
                (input)="onInputChange('nombre', $event)"
                required 
                placeholder="Ej. Ana Mendoza" 
                class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                [value]="formUsuario.email"
                (input)="onInputChange('email', $event)"
                required 
                placeholder="amendoza@farmakd.com" 
                class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div *ngIf="!usuarioEditandoId">
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Contraseña</label>
              <input 
                type="password" 
                [value]="formUsuario.password"
                (input)="onInputChange('password', $event)"
                placeholder="******" 
                class="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="activoCheck" 
                [checked]="formUsuario.activo"
                (change)="onCheckboxChange('activo', $event)"
                class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label for="activoCheck" class="text-sm font-semibold text-gray-700">Usuario Activo</label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                (click)="cerrarFormulario()" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow">
                Guardar en BD
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de Datos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="mb-6 relative">
          <input 
            type="text" 
            (input)="onSearchChange($event)"
            placeholder="Buscar usuario..." 
            class="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-xs font-bold text-gray-500 border-b border-gray-100 uppercase pb-3">
                <th class="py-3 px-4">Código</th>
                <th class="py-3 px-4">Usuario / Nombre</th>
                <th class="py-3 px-4">Roles Asignados</th>
                <th class="py-3 px-4 text-center">Estado</th>
                <th class="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr *ngFor="let u of usuariosFiltrados" class="hover:bg-gray-50/50 transition">
                <td class="py-4 px-4 font-semibold text-blue-600">{{ u.codigo || ('USR-00' + u.id) }}</td>
                <td class="py-4 px-4">
                  <div class="font-bold text-gray-900">{{ u.nombre }}</div>
                  <div class="text-xs text-gray-400">{{ u.email }}</div>
                </td>
                <td class="py-4 px-4">
                  <span *ngFor="let r of u.roles" class="inline-block bg-pink-100 text-pink-700 font-semibold text-xs px-2.5 py-1 rounded-full mr-1">
                    {{ r }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <span [class]="u.activo !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="font-bold text-xs px-3 py-1 rounded-full">
                    {{ u.activo !== false ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center space-x-2">
                  <button (click)="editarUsuario(u)" class="text-blue-600 hover:text-blue-800 font-bold p-1 mr-2" title="Editar">
                    ✏️
                  </button>
                  <button (click)="eliminarUsuario(u.id!)" class="text-red-500 hover:text-red-700 font-bold p-1" title="Eliminar">
                    🗑️
                  </button>
                </td>
              </tr>
              <tr *ngIf="usuariosFiltrados.length === 0">
                <td colspan="5" class="py-8 text-center text-gray-400">
                  No hay usuarios registrados en la base de datos de FastAPI.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UsuariosPageListComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/seguridad/usuarios';
  
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  mostrarFormulario: boolean = false;
  usuarioEditandoId: number | null = null;
  formUsuario: any = { nombre: '', email: '', password: '', activo: true };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.http.get<Usuario[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data || [];
        this.usuariosFiltrados = [...this.usuarios];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al consultar usuarios desde FastAPI:', err);
        this.usuarios = [];
        this.usuariosFiltrados = [];
        this.loading = false;
      }
    });
  }

  abrirFormulario(): void {
    this.usuarioEditandoId = null;
    this.formUsuario = { nombre: '', email: '', password: '', activo: true };
    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditandoId = usuario.id || null;
    this.formUsuario = { 
      nombre: usuario.nombre, 
      email: usuario.email, 
      activo: usuario.activo !== false 
    };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  onInputChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formUsuario[field] = input.value;
  }

  onCheckboxChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formUsuario[field] = input.checked;
  }

  guardarUsuario(event: Event): void {
    event.preventDefault();

    if (this.usuarioEditandoId) {
      this.http.put(`${this.apiUrl}/${this.usuarioEditandoId}`, this.formUsuario).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => console.error('Error al actualizar usuario:', err)
      });
    } else {
      this.http.post(this.apiUrl, this.formUsuario).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => console.error('Error al crear usuario:', err)
      });
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    if (!this.searchTerm) {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(u => 
        u.nombre.toLowerCase().includes(this.searchTerm) || 
        u.email.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario de la base de datos?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
        }
      });
    }
  }
}
