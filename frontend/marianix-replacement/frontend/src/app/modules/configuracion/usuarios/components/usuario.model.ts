import { Role } from '../../../../core/models/auth.model';

export interface UsuarioItem {
  id: number;
  codigo: string;
  nombreCompleto: string;
  username: string;
  email: string;
  roles: Role[];
  activo: boolean;
  ultimoAcceso?: string;
}
