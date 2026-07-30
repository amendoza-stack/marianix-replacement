export interface DrogaInterface {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface MonodrogaInterface {
  id: number;
  codigo: string;
  codigoSSS: string;
  descripcion: string;
  activo: boolean;
}

export interface PotenciaInterface {
  id: number;
  codigo: string;
  descripcion: string;
  abreviatura: string;
  activo: boolean;
}

export interface ViaAdministracionInterface {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
  esProtegido?: boolean;
}

export interface MaestroMedicamentoInterface {
  id: number;
  codigo: string;
  descripcion: string;
  tamano: string;
  laboratorioId: number;
  laboratorioNombre?: string;
  codOrigenPrecio: string;
  codIva: string;
  vigenciaFecha: string;
  codigoBarras?: string;
  monodrogaId: number;
  monodrogaNombre?: string;
  potenciaId?: number;
  potenciaNombre?: string;
  potencia: string;
  viaAdministracionId?: number;
  viaAdministracionNombre?: string;
  formaFarmaceutica: string;
  viaAdministracion: string;
  contenido: string;
  accion: string;
  multidroga: 'Sí' | 'No';
  estado: 'Activo' | 'Inactivo';
}
