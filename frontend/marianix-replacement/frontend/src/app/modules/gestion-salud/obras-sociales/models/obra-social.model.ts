export interface ObraSocialInterface {
  id?: number;
  codigo: string;
  descripcion: string;
  sigla?: string;
  cuit: string;
  provinciaId?: number;
  provinciaNombre?: string;
  localidad?: string;
  direccion?: string;
  telefonos?: string;
  mail?: string;
  activo: boolean;
  planesCount?: number;
  farmaciasOsCount?: number;
  planMonodrogasCount?: number;
}

export interface PlanCoberturaInterface {
  id?: number;
  obraSocialId: number;
  codigo: string;
  descripcion: string;
  porcentajeCobertura: number;
  copagoFijo: number;
  codigoSSS?: string;
  activo: boolean;
}

export interface FarmaciaOsInterface {
  id?: number;
  obraSocialId: number;
  codigoFarmaciaOs: string; // CODFAROS unico por OS
  farmaciaId: number;       // FK Padron General
  farmaciaCodigoInterno?: string;
  farmaciaRazonSocial?: string;
  farmaciaCuit?: string;
  activo: boolean;
}

export interface PlanMonodrogaInterface {
  id?: number;
  obraSocialId: number;
  planId: number;
  planDescripcion?: string;
  monodrogaId: number;
  monodrogaNombre?: string;
  laboratorioId: number;
  laboratorioNombre?: string;
  activo: boolean;
}
