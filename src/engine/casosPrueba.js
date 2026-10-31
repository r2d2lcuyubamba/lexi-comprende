/**
 * Casos de prueba del motor adaptativo (criterios de aceptación de HU-13 y RF-01).
 * Se usan en dos lugares: en las pruebas automatizadas (npm test, Vitest)
 * y en el "Panel de pruebas" de la app, para demostrarlas en vivo.
 */
import { porcentaje, registrarRespuesta, estadoInicial, simularSesion, REGLAS_V1, REGLAS_V1_1 } from "./motor.js";

const fmt = (x) => `${Math.round(x * 100)} %`;

export const CASOS = [
  {
    id: "T1",
    nombre: "Un acierto aumenta el porcentaje de aciertos",
    criterio: "HU-13",
    ejecutar: (reglas = REGLAS_V1) => {
      const { traza } = simularSesion([true, false, true], 2, reglas);
      const antes = traza[1].pct, despues = traza[2].pct;
      return { ok: despues > antes, detalle: `${fmt(antes)} → ${fmt(despues)}` };
    },
  },
  {
    id: "T2",
    nombre: "Un error disminuye el porcentaje de aciertos",
    criterio: "HU-13",
    ejecutar: (reglas = REGLAS_V1) => {
      const { traza } = simularSesion([true, true, false], 2, reglas);
      const antes = traza[1].pct, despues = traza[2].pct;
      return { ok: despues < antes, detalle: `${fmt(antes)} → ${fmt(despues)}` };
    },
  },
  {
    id: "T3",
    nombre: "No decide antes de tener 5 respuestas",
    criterio: "RF-01",
    ejecutar: (reglas = REGLAS_V1) => {
      const { traza } = simularSesion([true, true, true, true], 2, reglas);
      const ok = traza.every((t) => t.nivelDespues === 2);
      return { ok, detalle: "4 aciertos seguidos: el nivel sigue en 2" };
    },
  },
  {
    id: "T4",
    nombre: "Con 4 de 5 aciertos (80 %) sube de nivel",
    criterio: "RF-01",
    ejecutar: (reglas = REGLAS_V1) => {
      const { nivelFinal } = simularSesion([true, true, false, true, true], 2, reglas);
      return { ok: nivelFinal === 3, detalle: `✓✓✗✓✓ · nivel 2 → ${nivelFinal}` };
    },
  },
  {
    id: "T5",
    nombre: "Con 2 de 5 aciertos (40 %) baja de nivel",
    criterio: "HU-13",
    ejecutar: (reglas = REGLAS_V1) => {
      const { nivelFinal } = simularSesion([false, true, false, false, true], 3, reglas);
      return { ok: nivelFinal === 2, detalle: `✗✓✗✗✓ · nivel 3 → ${nivelFinal}` };
    },
  },
  {
    id: "T6",
    nombre: "El nivel nunca sale del rango 1–5",
    criterio: "HU-13",
    ejecutar: (reglas = REGLAS_V1) => {
      const a = simularSesion(Array(20).fill(false), 1, reglas).nivelFinal;
      const b = simularSesion(Array(20).fill(true), 5, reglas).nivelFinal;
      return { ok: a === 1 && b === 5, detalle: `20 errores en nivel 1 → ${a}; 20 aciertos en nivel 5 → ${b}` };
    },
  },
];

/** Caso añadido tras la Revisión del Sprint 1: subir de nivel sin acertar ninguna pregunta crítica. */
export const SECUENCIA_HALLAZGO = [true, true, true, true, false]; // la 5.ª pregunta es la crítica

export const CASO_HALLAZGO = {
  id: "T7",
  nombre: "No sube si falla todas las preguntas de una habilidad (✓✓✓✓✗, falla la crítica)",
  criterio: "HU-13b (Sprint 2)",
  ejecutar: (reglas = REGLAS_V1) => {
    const { nivelFinal } = simularSesion(SECUENCIA_HALLAZGO, 2, reglas);
    return { ok: nivelFinal === 2, detalle: nivelFinal === 3 ? "Sube al nivel 3 con 80 % aunque falló la única pregunta crítica" : "Se mantiene en el nivel 2 hasta acertar una pregunta crítica" };
  },
};

export function ejecutarTodos(reglas = REGLAS_V1) {
  return [...CASOS, CASO_HALLAZGO].map((c) => {
    const t0 = performance.now();
    const r = c.ejecutar(reglas);
    return { id: c.id, nombre: c.nombre, criterio: c.criterio, ...r, ms: performance.now() - t0 };
  });
}

export { REGLAS_V1, REGLAS_V1_1, porcentaje, registrarRespuesta, estadoInicial };
