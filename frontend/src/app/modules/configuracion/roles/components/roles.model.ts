export interface ModuloPermiso {
  moduloId: string;
  moduloNombre: string;
  lectura: boolean;
  escritura: boolean;
  eliminacion: boolean;
  auditoria: boolean;
}

export interface RolItem {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  esSistema: boolean;
  activo: boolean;
  permisos: ModuloPermiso[];
}
