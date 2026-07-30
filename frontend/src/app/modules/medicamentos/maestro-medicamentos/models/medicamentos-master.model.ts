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
  potencia: string;
  formaFarmaceutica: string;
  viaAdministracion: string;
  contenido: string;
  accion: string;
  multidroga: 'Sí' | 'No';
  estado: 'Activo' | 'Inactivo';
}
