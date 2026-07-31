export interface BonificacionInterface {
  id?: number;
  codigo: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre?: string;
  obraSocialId: number;
  obraSocialNombre?: string;
  planId: number;
  planNombre?: string;
  ubicacionId: number;
  ubicacionNombre?: string;
  farmaciaOsId: number;
  codigoFarmaciaOs: string;
  farmaciaNombre: string;
  valor1: number;
  valor2: number;
  activo: boolean;
  fechaAlta?: string;
  usuarioAlta?: string;
}

export interface BonificacionFiltroDto {
  codigo?: string;
  descripcion?: string;
  categoriaId?: number;
  obraSocialId?: number;
  planId?: number;
  ubicacionId?: number;
  farmaciaOsId?: number;
  activo?: boolean;
}

export interface BonificacionConsultaRecetaRequestDto {
  categoriaId: number;
  obraSocialId: number;
  planId: number;
  ubicacionId: number;
  farmaciaOsId: number;
}

export interface BonificacionConsultaRecetaResponseDto {
  encontrado: boolean;
  valor1: number;
  valor2: number;
  bonificacionId?: number;
  mensaje?: string;
}
