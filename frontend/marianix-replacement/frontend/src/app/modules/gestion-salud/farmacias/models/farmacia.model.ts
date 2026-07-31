export interface FarmaciaInterface {
  id?: number;
  codigo: string;
  descripcion: string;
  paisId: number;
  paisNombre?: string;
  provinciaId: number;
  provinciaNombre?: string;
  localidad?: string;
  ciudad?: string;
  direccion?: string;
  numero?: string;
  codigoPostal?: string;
  telefonos?: string;
  pami?: string;
  contactos?: string;
  mail?: string;
  ubicacionId: number;
  ubicacionNombre?: string;
  zonaId: number;
  zonaNombre?: string;
  responsableDT?: string;
  cuit: string;
  banco?: string;
  cuentaBancaria?: string;
  titularCuenta?: string;
  cbu?: string;
  fechaAlta?: string;
  modificarBonificacion: 'Sí' | 'No';
  drogueriaId: number;
  drogueriaNombre?: string;
  estadoLegal?: string;
  observaciones?: string;
  cuf: string;
  activo: boolean;
}

export interface FarmaciaConvenioObraSocialInterface {
  id?: number;
  obraSocialId: number;
  farmaciaId: number;
  farmaciaCodigo?: string;
  farmaciaDescripcion?: string;
  farmaciaCuit?: string;
  farmaciaCuf?: string;
  codigoConvenioInterno?: string;
  bonificacionAcordada?: number;
  fechaInicioConvenio?: string;
  fechaFinConvenio?: string;
  estadoConvenio: 'Activo' | 'Suspendido' | 'Inactivo';
  observacionesConvenio?: string;
}

export interface FarmaciaColegioInterface {
  id?: number;
  farmaciaId: number;
  farmaciaCodigo?: string;
  farmaciaNombre?: string;
  farmaciaCuit?: string;
  farmaciaCuf?: string;
  colegioFarmaceuticoId: number;
  colegioCodigo?: string;
  colegioFarmaceuticoNombre?: string;
  estado: 'Activo' | 'Inactivo';
  fechaAlta?: string;
  usuarioAlta?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
  activo?: boolean;
}
