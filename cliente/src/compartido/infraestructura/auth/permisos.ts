import type { RolUsuario } from './roles';

export type Permiso =
  | 'gestionar_usuarios'
  | 'gestionar_roles'
  | 'gestionar_instituciones'
  | 'gestionar_preguntas'
  | 'gestionar_examenes'
  | 'ver_estadisticas_generales'
  | 'enviar_notificaciones_masivas'
  | 'ver_institucion_asignada'
  | 'gestionar_usuarios_institucion'
  | 'ver_resultados_institucion'
  | 'ver_estudiantes_grupo'
  | 'gestionar_grupos'
  | 'usar_banco_preguntas'
  | 'ver_examenes_asignados'
  | 'ver_resultados_grupo'
  | 'editar_perfil_basico'
  | 'iniciar_examen'
  | 'responder_examen'
  | 'usar_modo_practica'
  | 'ver_resultados_propios'
  | 'descargar_certificado';

export const permisosPorRol: Record<RolUsuario, Permiso[]> = {
  administrador: [
    'gestionar_usuarios',
    'gestionar_roles',
    'gestionar_instituciones',
    'gestionar_preguntas',
    'gestionar_examenes',
    'ver_estadisticas_generales',
    'enviar_notificaciones_masivas',
    'ver_institucion_asignada',
    'gestionar_usuarios_institucion',
    'ver_resultados_institucion',
    'ver_estudiantes_grupo',
    'gestionar_grupos',
    'usar_banco_preguntas',
    'ver_examenes_asignados',
    'ver_resultados_grupo',
    'editar_perfil_basico',
    'iniciar_examen',
    'responder_examen',
    'usar_modo_practica',
    'ver_resultados_propios',
    'descargar_certificado',
  ],

  coordinador: [
    'ver_institucion_asignada',
    'gestionar_usuarios_institucion',
    'ver_resultados_institucion',
  ],

  profesor: [
    'ver_estudiantes_grupo',
    'gestionar_grupos',
    'usar_banco_preguntas',
    'ver_examenes_asignados',
    'ver_resultados_grupo',
  ],

  estudiante: [
    'editar_perfil_basico',
    'iniciar_examen',
    'responder_examen',
    'usar_modo_practica',
    'ver_resultados_propios',
    'descargar_certificado',
  ],
};