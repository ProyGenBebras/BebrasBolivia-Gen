const CLAVE_TOKEN = 'bebras.token';

export function obtenerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CLAVE_TOKEN);
}

export function iniciarSesion(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CLAVE_TOKEN, token);
}

export function cerrarSesion(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CLAVE_TOKEN);
}
