export interface ModuloPermiso {
  moduloId: string;
  moduloNombre: string;
  categoria: 'CONFIGURACION' | 'GESTION_MEDICA' | 'GENERAL';
  lectura: boolean;
  escritura: boolean;
  eliminacion: boolean;
  auditoria: boolean;
}

export interface RolItem {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  esSistema: boolean;
  activo: boolean;
  permisos: ModuloPermiso[];
}

export const LISTA_MODULOS_DEFAULT: ModuloPermiso[] = [
  // GENERAL
  { moduloId: 'dash', moduloNombre: 'Dashboard General / KPIs', categoria: 'GENERAL', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  
  // CONFIGURACIÓN / ABMs
  { moduloId: 'usr', moduloNombre: 'Usuarios y Accesos', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: true, auditoria: true },
  { moduloId: 'rol', moduloNombre: 'Roles y Permisos', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: true, auditoria: true },
  { moduloId: 'paises', moduloNombre: 'Países', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'prov', moduloNombre: 'Provincias', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'drog', moduloNombre: 'Droguerías', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'peri', moduloNombre: 'Períodos Fiscales', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'espe', moduloNombre: 'Especialidades Médicas', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'obse', moduloNombre: 'Observaciones', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'pato', moduloNombre: 'Patologías', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'ubic', moduloNombre: 'Ubicaciones', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'vinc', moduloNombre: 'Vínculos Familiares', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'zona', moduloNombre: 'Zonas Geo-Sanitarias', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'cole', moduloNombre: 'Colegios Farmacéuticos', categoria: 'CONFIGURACION', lectura: true, escritura: true, eliminacion: false, auditoria: true },

  // GESTIÓN MÉDICA
  { moduloId: 'afil', moduloNombre: 'Padrón de Afiliados', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'medi', moduloNombre: 'Padrón de Médicos', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'os', moduloNombre: 'Obras Sociales y Prepagas', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'plan', moduloNombre: 'Planes Cobertura', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'farm', moduloNombre: 'Farmacias Prestadoras', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'mono', moduloNombre: 'Plan Monodrogas / Vademécum', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true },
  { moduloId: 'lab', moduloNombre: 'Laboratorios', categoria: 'GESTION_MEDICA', lectura: true, escritura: true, eliminacion: false, auditoria: true }
];
