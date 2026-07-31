export interface MedicoInterface {
  id: number;
  codigo: string;
  apellido: string;
  nombre: string;
  matricula: string;
  especialidadId: number;
  especialidadNombre?: string;
  tipoMatricula: 'Nacional' | 'Provincial';
  estado: 'Activo' | 'Inactivo';
  cuit?: string;
  telefono?: string;
  mail?: string;
  observaciones?: string;
  fechaAlta?: string;
  usuarioAlta?: string;
}

export interface MedicoDTO extends MedicoInterface {}

export class MedicoMapper {
  static normalizeText(str: string): string {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ').toUpperCase();
  }
}
