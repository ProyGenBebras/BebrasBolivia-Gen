export function obtenerMensajeErrorAcceso(codigoEstado: number): string {
  if (codigoEstado === 401) {
    return 'Debes iniciar sesión para acceder a esta sección.';
  }

  if (codigoEstado === 403) {
    return 'No tienes permisos para realizar esta acción.';
  }

  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}

export function esErrorDeAcceso(codigoEstado: number): boolean {
  return codigoEstado === 401 || codigoEstado === 403;
}
