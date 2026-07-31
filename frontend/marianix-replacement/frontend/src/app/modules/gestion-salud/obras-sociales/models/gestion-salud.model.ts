export interface PlanCoberturaItem {
  id: number;
  codigo: string;
  nombrePlan: string;
  coberturaPorcentaje: number;
  copagoFijo: number;
  activo: boolean;
}

export interface FarmaciaOSItem {
  id: number;
  cuit: string;
  razonSocial: string;
  direccion: string;
  localidad: string;
  activa: boolean;
}

export interface MonodrogaPlanItem {
  id: number;
  monodrogaNombre: string;
  planNombre: string;
  coberturaEspecial: number;
  requiereAuditoria: boolean;
}

export interface ObraSocialInterface {
  id: number;
  codigo: string;
  razonSocial: string;
  sigla: string;
  cuit: string;
  estado: 'Activa' | 'Inactiva';
  telefono?: string;
  email?: string;
  planes: PlanCoberturaItem[];
  farmacias: FarmaciaOSItem[];
  monodrogas: MonodrogaPlanItem[];
}

export interface LaboratorioInterface {
  id: number;
  codigo: string;
  razonSocial: string;
  cuit: string;
  estado: 'Activo' | 'Inactivo';
  telefono?: string;
  contacto?: string;
}
