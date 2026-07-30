export interface BaseTablaAuxiliar {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
  fechaAlta: string;
  fechaModificacion?: string;
  usuarioAlta: string;
  usuarioModificacion?: string;
}

export interface PaisItem extends BaseTablaAuxiliar {}

export interface ProvinciaItem extends BaseTablaAuxiliar {
  paisId: number;
  paisNombre?: string;
}

export interface UbicacionItem extends BaseTablaAuxiliar {
  esProtegido?: boolean;
}

export interface ZonaItem extends BaseTablaAuxiliar {}

export interface ColegioFarmaceuticoItem extends BaseTablaAuxiliar {}

export interface CategoriaMedicamentoItem extends BaseTablaAuxiliar {
  esProtegido?: boolean;
}

export interface TipoPatologiaItem extends BaseTablaAuxiliar {}

export interface EspecialidadMedicaItem extends BaseTablaAuxiliar {}

export interface ObservacionItem extends BaseTablaAuxiliar {}

export interface VinculoItem extends BaseTablaAuxiliar {}

export interface PeriodoItem extends BaseTablaAuxiliar {
  fechaDesde: string;
  fechaHasta: string;
}

export interface DrogueriaItem extends BaseTablaAuxiliar {}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
