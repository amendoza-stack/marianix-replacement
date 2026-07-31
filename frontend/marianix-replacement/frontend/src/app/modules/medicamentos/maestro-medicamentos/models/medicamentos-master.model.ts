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

export interface AccionTerapeurticaInterface {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface MaestroMedicamentoInterface {
  id: number;
  codigo: string;
  descripcion: string;
  tamano?: string;
  laboratorioId: number;
  laboratorioNombre?: string;
  codOrigenPrecio?: string;
  codIva?: string;
  vigenciaFecha: string;
  codigoBarras?: string;
  codigoTrazabilidad?: string;
  monodrogaId: number;
  monodrogaNombre?: string;
  potenciaId?: number;
  potenciaNombre?: string;
  potencia?: string;
  viaAdministracionId?: number;
  viaAdministracionNombre?: string;
  viaAdministracion?: string;
  formaFarmaceuticaId?: number;
  formaFarmaceuticaNombre?: string;
  formaFarmaceutica?: string;
  accionTerapeurticaId?: number;
  accionTerapeurticaNombre?: string;
  accion?: string;
  contenido?: string;
  precioAlfa?: number;
  precioVenta?: number;
  precioPublico?: number;
  observaciones?: string;
  multidroga?: 'Sí' | 'No';
  estado: 'Activo' | 'Inactivo';
}
