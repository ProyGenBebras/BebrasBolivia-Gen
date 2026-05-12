export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rolId: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}