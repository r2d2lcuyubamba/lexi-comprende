// Pruebas automatizadas del motor adaptativo (ejecutar con: npm test)
import { describe, it, expect } from "vitest";
import { porcentaje, evaluarVentana, registrarRespuesta, estadoInicial, simularSesion, REGLAS_V1, REGLAS_V1_1 } from "./motor.js";
import { CASOS, CASO_HALLAZGO } from "./casosPrueba.js";

describe("Motor de ventana móvil v1 — criterios de aceptación HU-13 / RF-01", () => {
  for (const caso of CASOS) {
    it(`${caso.id} ${caso.nombre}`, () => {
      const r = caso.ejecutar();
      expect(r.ok, r.detalle).toBe(true);
    });
  }
});

describe("Cálculo del porcentaje y de la decisión", () => {
  const v = (s) => [...s].map((c) => ({ habilidad: "literal", correcta: c === "1" }));
  it("4 aciertos de 5 = 80 %", () => {
    expect(porcentaje(v("11011"))).toBeCloseTo(0.8, 10);
  });
  it("3 de 5 (60 %) mantiene el nivel", () => {
    expect(evaluarVentana(v("10101"), 2).accion).toBe("Mantiene nivel");
  });
  it("la ventana guarda solo las últimas 5 respuestas", () => {
    let e = estadoInicial(1);
    for (const c of [false, false, true, true, true, true]) e = registrarRespuesta(e, "literal", c, { ...REGLAS_V1, nivelMax: 1 }).estado;
    expect(e.ventana.length).toBe(5);
    expect(porcentaje(e.ventana)).toBeCloseTo(0.8, 10);
  });
  it("al cambiar de nivel la ventana empieza de nuevo", () => {
    const { estado } = simularSesion([true, true, true, true, true], 2);
    expect(estado.nivel).toBe(3);
    expect(estado.ventana.length).toBe(0);
  });
  it("registrarRespuesta no modifica el estado original", () => {
    const e = estadoInicial(2);
    registrarRespuesta(e, "literal", true);
    expect(e.ventana.length).toBe(0);
  });
});

describe("Hallazgo de la Revisión del Sprint 1", () => {
  it("v1 sube de nivel aunque falle la única pregunta crítica (comportamiento documentado)", () => {
    expect(CASO_HALLAZGO.ejecutar(REGLAS_V1).ok).toBe(false);
  });
  it("v1.1 (propuesta HU-13b) exige acertar al menos una pregunta de cada habilidad para subir", () => {
    expect(CASO_HALLAZGO.ejecutar(REGLAS_V1_1).ok).toBe(true);
  });
});
