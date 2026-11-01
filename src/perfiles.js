// Perfiles de estudiantes guardados en el dispositivo (Sprint 1).
// Cada combinación código de aula + avatar tiene su propio progreso.
// En el Sprint 2 este guardado se reemplaza por cuentas en el servidor (Laravel + MySQL, HU-11/HU-20).
import { estadoInicial } from "./engine/motor.js";

const CLAVE = "lexi-comprende:v2";
const CLAVE_ANTERIOR = "lexi-comprende:v1"; // versión con un solo perfil

export const claveDe = (usuario) => `${usuario.codigo}:${usuario.avatarId}`;
export const perfilNuevo = (usuario) => ({ usuario, motor: estadoInicial(2), monedas: 0, lecturas: 0, perfectas: 0, registro: [] });

const vacio = () => ({ activo: null, perfiles: {} });

export function cargarDatos() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado?.perfiles) return guardado;
    // Migración: si existía un perfil único de la versión anterior, se conserva.
    const anterior = JSON.parse(localStorage.getItem(CLAVE_ANTERIOR));
    if (anterior?.usuario) {
      const k = claveDe(anterior.usuario);
      return { activo: k, perfiles: { [k]: anterior } };
    }
  } catch { /* sin almacenamiento disponible */ }
  return vacio();
}

export function guardarDatos(datos) {
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); localStorage.removeItem(CLAVE_ANTERIOR); } catch { /* sin almacenamiento */ }
}

/** Entra con un usuario: retoma su perfil si existe o crea uno nuevo. */
export function entrar(datos, usuario) {
  const k = claveDe(usuario);
  const existente = datos.perfiles[k];
  return { activo: k, perfiles: { ...datos.perfiles, [k]: existente || perfilNuevo(usuario) } };
}

/** Cierra la sesión sin borrar el progreso. */
export const salir = (datos) => ({ ...datos, activo: null });

/** Aplica un cambio al perfil activo. */
export function actualizarActivo(datos, cambio) {
  if (!datos.activo) return datos;
  return { ...datos, perfiles: { ...datos.perfiles, [datos.activo]: cambio(datos.perfiles[datos.activo]) } };
}

/** Nivel guardado de cada avatar para un código de aula: { avatarId: nivel }. */
export function nivelesPorAvatar(datos, codigo) {
  const out = {};
  for (const p of Object.values(datos.perfiles)) if (p.usuario.codigo === codigo) out[p.usuario.avatarId] = { nivel: p.motor.nivel, lecturas: p.lecturas };
  return out;
}

export const borrarTodo = () => vacio();
