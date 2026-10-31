/**
 * Motor adaptativo de Lexi Comprende — Ventana móvil de aciertos
 * Historia de usuario HU-13 · Requerimiento RF-01.
 *
 * Idea: el nivel del estudiante se decide mirando sus últimas 5 respuestas
 * (solo el primer intento de cada pregunta) en el nivel actual.
 *   - 80 % o más de aciertos (4 o 5 de 5)  → sube de nivel
 *   - 40 % o menos de aciertos (0, 1 o 2)  → baja de nivel
 *   - en otro caso (3 de 5)                → se mantiene
 * Al cambiar de nivel, la ventana empieza de nuevo.
 */

export const HABILIDADES = ["literal", "inferencial", "critica"];

/** Reglas del Sprint 1 (v1). */
export const REGLAS_V1 = Object.freeze({
  tamanoVentana: 5, // una lectura = 5 preguntas
  subir: 0.8, // 80 % de aciertos
  bajar: 0.4, // 40 % de aciertos
  exigirCadaHabilidad: false, // v1: no revisa las habilidades por separado
  nivelMin: 1,
  nivelMax: 5,
});

/** Propuesta para el Sprint 2 (HU-13b): para subir, debe acertar al menos una pregunta de cada habilidad presente. */
export const REGLAS_V1_1 = Object.freeze({ ...REGLAS_V1, exigirCadaHabilidad: true });

export function estadoInicial(nivel = 2) {
  return {
    nivel,
    ventana: [], // [{ habilidad, correcta }] del nivel actual (máximo 5)
    porHabilidad: Object.fromEntries(HABILIDADES.map((h) => [h, []])), // últimas 5 respuestas de cada habilidad
  };
}

/** Porcentaje de aciertos de una lista de respuestas (0 a 1). Devuelve null si está vacía. */
export function porcentaje(respuestas) {
  if (!respuestas.length) return null;
  return respuestas.filter((r) => r.correcta).length / respuestas.length;
}

/** Habilidades presentes en la ventana sin ningún acierto. */
export function habilidadesSinAcierto(ventana) {
  const presentes = [...new Set(ventana.map((r) => r.habilidad))];
  return presentes.filter((h) => !ventana.some((r) => r.habilidad === h && r.correcta));
}

/** Decide el nivel a partir de una ventana. No modifica nada. */
export function evaluarVentana(ventana, nivel, reglas = REGLAS_V1) {
  const pct = porcentaje(ventana);
  if (ventana.length < reglas.tamanoVentana) return { accion: "Aún sin decisión", pct, nivel };
  const faltan = habilidadesSinAcierto(ventana);
  if (pct >= reglas.subir && nivel < reglas.nivelMax) {
    if (reglas.exigirCadaHabilidad && faltan.length) return { accion: "Mantiene nivel (falta acertar " + faltan.join(", ") + ")", pct, nivel };
    return { accion: "Sube de nivel", pct, nivel: nivel + 1 };
  }
  if (pct <= reglas.bajar && nivel > reglas.nivelMin) return { accion: "Baja de nivel", pct, nivel: nivel - 1 };
  return { accion: "Mantiene nivel", pct, nivel };
}

/**
 * Registra una respuesta (primer intento) y decide el nivel.
 * Devuelve { estado, evento } sin modificar el estado recibido.
 */
export function registrarRespuesta(estado, habilidad, correcta, reglas = REGLAS_V1) {
  const r = { habilidad, correcta };
  const ventana = [...estado.ventana, r].slice(-reglas.tamanoVentana);
  const porHabilidad = { ...estado.porHabilidad, [habilidad]: [...(estado.porHabilidad[habilidad] || []), r].slice(-5) };
  const d = evaluarVentana(ventana, estado.nivel, reglas);
  const cambia = d.nivel !== estado.nivel;
  return {
    estado: { nivel: d.nivel, ventana: cambia ? [] : ventana, porHabilidad },
    evento: {
      habilidad, correcta,
      aciertos: ventana.filter((x) => x.correcta).length, total: ventana.length, pct: d.pct,
      nivelAntes: estado.nivel, nivelDespues: d.nivel, accion: d.accion,
    },
  };
}

/** Orden de habilidades de una lectura de 5 preguntas (como en los textos piloto). */
export const PATRON_LECTURA = ["literal", "literal", "inferencial", "inferencial", "critica"];

/** Simula una sesión: lista de respuestas (true/false); la habilidad sigue el patrón de una lectura. */
export function simularSesion(respuestas, nivelInicial = 2, reglas = REGLAS_V1) {
  let estado = estadoInicial(nivelInicial);
  const traza = respuestas.map((correcta, i) => {
    const habilidad = PATRON_LECTURA[i % PATRON_LECTURA.length];
    const r = registrarRespuesta(estado, habilidad, correcta, reglas);
    estado = r.estado;
    return { n: i + 1, ...r.evento };
  });
  return { traza, nivelFinal: estado.nivel, estado };
}
