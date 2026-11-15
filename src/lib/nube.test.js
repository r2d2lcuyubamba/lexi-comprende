// Pruebas de la conexión con Supabase (HU-21): cola sin conexión y no duplicados.
import { describe, it, expect } from "vitest";
import { crearNube } from "./nube.js";

const almacenFalso = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
const respuesta = { codigo: "4B7K", avatarId: "lucia", alias: "Lucía", lecturaId: "condor-apu", habilidad: "critica", correcta: false, nivel: 2 };

describe("HU-21 · Registro de respuestas en la nube", () => {
  it("sin claves de Supabase la app funciona solo en el dispositivo", async () => {
    const nube = crearNube({ url: undefined, clave: undefined, almacen: almacenFalso() });
    expect(nube.activa).toBe(false);
    expect(await nube.enviarRespuesta(respuesta)).toBe(0);
  });

  it("envía el primer intento a la función registrar_respuesta", async () => {
    const llamadas = [];
    const fetchFn = async (url, op) => { llamadas.push({ url, cuerpo: JSON.parse(op.body) }); return { ok: true, text: async () => "" }; };
    const nube = crearNube({ url: "https://x.supabase.co", clave: "k", fetchFn, almacen: almacenFalso() });
    expect(await nube.enviarRespuesta(respuesta)).toBe(0);
    expect(llamadas[0].url).toBe("https://x.supabase.co/rest/v1/rpc/registrar_respuesta");
    expect(llamadas[0].cuerpo.p_habilidad).toBe("critica");
    expect(llamadas[0].cuerpo).not.toHaveProperty("nombre"); // HU-15: sin datos personales
  });

  it("sin internet guarda en la cola y reenvía al reconectar con el mismo id (sin duplicados)", async () => {
    let enLinea = false;
    const ids = [];
    const fetchFn = async (_url, op) => {
      if (!enLinea) throw new Error("sin conexión");
      ids.push(JSON.parse(op.body).p_id_cliente);
      return { ok: true, text: async () => "" };
    };
    const nube = crearNube({ url: "https://x.supabase.co", clave: "k", fetchFn, almacen: almacenFalso() });
    expect(await nube.enviarRespuesta(respuesta)).toBe(1);
    expect(await nube.enviarRespuesta({ ...respuesta, correcta: true })).toBe(2);
    enLinea = true;
    expect(await nube.sincronizar()).toBe(0);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
  });
});
