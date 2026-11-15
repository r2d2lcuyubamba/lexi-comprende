/**
 * Conexión de la app del estudiante con Supabase (Sprint 2 · HU-21, HU-15).
 *
 * - La app solo llama a dos funciones públicas de la base de datos:
 *   validar_codigo y registrar_respuesta (ver supabase/schema.sql).
 *   No tiene acceso directo a ninguna tabla (RLS).
 * - Si no hay internet, las respuestas quedan en una cola en el dispositivo
 *   y se reenvían al reconectar. Cada respuesta lleva un id_cliente único,
 *   así que un reenvío nunca crea duplicados.
 * - Si no hay variables de entorno (por ejemplo, en la demo de GitHub Pages
 *   del Sprint 1), la app sigue funcionando solo en el dispositivo.
 */

const CLAVE_COLA = "lexi-comprende:cola";

export function crearNube({ url, clave, fetchFn = globalThis.fetch, almacen = globalThis.localStorage } = {}) {
  const activa = Boolean(url && clave && fetchFn);

  const leerCola = () => { try { return JSON.parse(almacen?.getItem(CLAVE_COLA)) || []; } catch { return []; } };
  const guardarCola = (cola) => { try { almacen?.setItem(CLAVE_COLA, JSON.stringify(cola)); } catch { /* sin almacenamiento */ } };

  async function rpc(funcion, params) {
    const r = await fetchFn(`${url}/rest/v1/rpc/${funcion}`, {
      method: "POST",
      headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!r.ok) throw new Error(`Supabase respondió ${r.status}`);
    const texto = await r.text();
    return texto ? JSON.parse(texto) : null;
  }

  /** Devuelve el nombre del aula o null si el código no existe. */
  async function validarCodigo(codigo) {
    if (!activa) return null;
    try { return await rpc("validar_codigo", { p_codigo: codigo }); } catch { return null; }
  }

  /** Envía todo lo pendiente; lo que falle queda en la cola. Devuelve cuántas quedan. */
  async function sincronizar() {
    if (!activa) return leerCola().length;
    const pendientes = [];
    for (const item of leerCola()) {
      try { await rpc("registrar_respuesta", item); } catch { pendientes.push(item); }
    }
    guardarCola(pendientes);
    return pendientes.length;
  }

  /** Registra el primer intento de una respuesta (HU-21). */
  async function enviarRespuesta({ codigo, avatarId, alias, lecturaId, habilidad, correcta, nivel }) {
    if (!activa) return 0;
    const item = {
      p_id_cliente: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      p_codigo: codigo, p_avatar: avatarId, p_alias: alias, p_lectura: lecturaId,
      p_habilidad: habilidad, p_correcta: correcta, p_nivel: nivel,
    };
    guardarCola([...leerCola(), item]);
    return sincronizar();
  }

  return { activa, validarCodigo, enviarRespuesta, sincronizar, pendientes: () => leerCola().length };
}

// Instancia de la app: lee las claves públicas de .env (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
export const nube = crearNube({
  url: import.meta.env?.VITE_SUPABASE_URL,
  clave: import.meta.env?.VITE_SUPABASE_ANON_KEY,
});

if (typeof window !== "undefined" && nube.activa) {
  window.addEventListener("online", () => nube.sincronizar());
}
