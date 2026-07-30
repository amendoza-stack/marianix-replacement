export interface NovedadItemDto {
  lineaIndex: number;
  codigo?: string;
  descripcion: string;
  laboratorioNombre?: string;
  monodrogaNombre?: string;
  potencia?: string;
  formaFarmaceutica?: string;
  viaAdministracion?: string;
  accionTerapeurtica?: string;
  codigoBarras?: string;
  codigoTrazabilidad?: string;
  codIva?: string;
  precioAlfa?: number;
  precioVenta?: number;
  precioPublico?: number;
  origenPrecio?: string;
  contenido?: string;
  multidroga?: 'Sí' | 'No';
  vigenciaFecha?: string;
  estadoFila: 'Valido' | 'Advertencia' | 'Error';
  accionPlanificada: 'Insertar' | 'Actualizar' | 'Rechazar';
  mensajesValidacion: string[];
}

export interface ValidacionArchivoResultadoDto {
  nombreArchivo: string;
  cantidadTotal: number;
  cantidadInsertar: number;
  cantidadActualizar: number;
  cantidadErrores: number;
  cantidadAdvertencias: number;
  items: NovedadItemDto[];
}

export interface HistorialImportacionInterface {
  id: number;
  usuario: string;
  fecha: string;
  archivoNombre: string;
  cantidadInsertados: number;
  cantidadActualizados: number;
  cantidadRechazados: number;
  tiempoProcesamientoSegundos: number;
  estado: 'Exitoso' | 'Parcial' | 'Fallido';
  observaciones?: string;
}
