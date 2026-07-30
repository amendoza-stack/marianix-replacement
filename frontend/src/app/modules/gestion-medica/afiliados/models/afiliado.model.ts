export interface AfiliadoInterface {
  id: number;
  codigo: string;
  apellido: string;
  nombre: string;
  obraSocialId: number;
  obraSocialNombre?: string;
  numeroAfiliado: string;
  estado: 'Activo' | 'Inactivo';
  dni: string;
  cuil: string;
  vinculoId: number;
  vinculoNombre?: string;
  sexo: 'Masculino' | 'Femenino' | 'Otro';
  fechaNacimiento: string;
  edad?: number;
  tipoBeneficiario: 'Titular' | 'Cónyuge' | 'Hijo' | 'Padre' | 'Madre' | 'Otro';
  observaciones?: string;
  fechaAlta?: string;
  usuarioAlta?: string;
}

export interface AfiliadoDTO extends Omit<AfiliadoInterface, 'edad'> {}

export class AfiliadoMapper {
  static calcularEdad(fechaNacStr: string): number {
    if (!fechaNacStr) return 0;
    const nac = new Date(fechaNacStr);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return edad < 0 ? 0 : edad;
  }

  static toDomain(dto: AfiliadoDTO): AfiliadoInterface {
    return {
      ...dto,
      edad: this.calcularEdad(dto.fechaNacimiento)
    };
  }

  static normalizeText(str: string): string {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ').toUpperCase();
  }
}
