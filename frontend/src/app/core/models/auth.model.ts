export type Role = 'SUPERADMIN' | 'ADMINISTRADOR' | 'AUDITOR_MEDICO' | 'OPERADOR' | 'FARMACEUTICO';

export interface UserPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canAudit: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  nombreCompleto: string;
  role: Role;
  permissions: UserPermissions;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}
