import { useMemo, useState } from "react";
import { simularSesion, evaluarVentana, REGLAS_V1, REGLAS_V1_1, PATRON_LECTURA } from "../engine/motor.js";
import { ejecutarTodos, SECUENCIA_HALLAZGO } from "../engine/casosPrueba.js";
import { NOMBRE_HABILIDAD } from "../data/lecturas.js";

const pc = (x) => (x == null ? "—" : `${Math.round(x * 100)} %`);
const corto = (h) => NOMBRE_HABILIDAD[h].replace("Comprensión ", "");
const colorAccion = (a) => (a.startsWith("Sube") ? "#168060" : a.startsWith("Baja") ? "#C23B1E" : "#5B3FD0");

function Grafico({ traza, reglas }) {
  const W = 640, H = 260, m = { l: 48, r: 16, t: 18, b: 40 };
  const n = Math.max(traza.length, 1);
  const x = (i) => m.l + (n === 1 ? (W - m.l - m.r) / 2 : (i * (W - m.l - m.r)) / (n - 1));
  const y = (v) => m.t + (1 - v) * (H - m.t - m.b);
  const pts = traza.map((t, i) => `${x(i)},${y(t.pct)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Porcentaje de aciertos en la ventana por actividad">
      <rect x={m.l} y={y(1)} width={W - m.l - m.r} height={y(reglas.subir) - y(1)} fill="#D8F3EA" />
      <rect x={m.l} y={y(reglas.bajar)} width={W - m.l - m.r} height={y(0) - y(reglas.bajar)} fill="#FFE1DA" />
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
        <g key={v}><line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#E6E3F3" /><text x={m.l - 8} y={y(v) + 4} fontSize="11" textAnchor="end" fill="#6B6F86">{v * 100} %</text></g>
      ))}
      {traza.length > 1 && <polyline points={pts} fill="none" stroke="#5B3FD0" strokeWidth="3" />}
      {traza.map((t, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(t.pct)} r={t.total === reglas.tamanoVentana ? 7 : 5} fill={t.total === reglas.tamanoVentana ? colorAccion(t.accion) : "#B9AEEA"} />
          <text x={x(i)} y={y(t.pct) - 11} fontSize="11" fontWeight="700" textAnchor="middle" fill="#1E2340">{t.aciertos}/{t.total}</text>
          <text x={x(i)} y={H - 20} fontSize="11" textAnchor="middle" fill="#4A4F68">Act. {i + 1}</text>
          <text x={x(i)} y={H - 6} fontSize="11" textAnchor="middle" fill={t.correcta ? "#168060" : "#C23B1E"}>{t.correcta ? "✓" : "✗"} N{t.nivelAntes}</text>
        </g>
      ))}
    </svg>
  );
}

function TablaTraza({ traza }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-texto">
        <thead><tr className="text-left text-gris text-xs">
          <th className="py-2 pr-2">#</th><th className="pr-2">Habilidad</th><th className="pr-2">Respuesta</th><th className="pr-2">Ventana</th><th className="pr-2">% aciertos</th><th className="pr-2">Nivel</th><th>Decisión</th>
        </tr></thead>
        <tbody>
          {traza.map((t, i) => (
            <tr key={i} className="border-t border-[#EEE]">
              <td className="py-1.5 pr-2">{i + 1}</td>
              <td className="pr-2">{corto(t.habilidad)}</td>
              <td className={`pr-2 font-semibold ${t.correcta ? "text-verde-oscuro" : "text-[#C23B1E]"}`}>{t.correcta ? "Acierto" : "Error"}</td>
              <td className="pr-2 tabular-nums">{t.aciertos} de {t.total}</td>
              <td className="pr-2 font-semibold tabular-nums">{pc(t.pct)}</td>
              <td className="pr-2">{t.nivelAntes}{t.nivelDespues !== t.nivelAntes && ` → ${t.nivelDespues}`}</td>
              <td className={t.accion.startsWith("Sube") || t.accion.startsWith("Baja") ? "font-semibold" : "text-gris"}>{t.accion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Calculadora({ reglas }) {
  const [resp, setResp] = useState([true, true, false, true, true]);
  const ventana = resp.map((c, i) => ({ habilidad: PATRON_LECTURA[i], correcta: c }));
  const aciertos = resp.filter(Boolean).length;
  const d = evaluarVentana(ventana, 2, reglas);
  return (
    <section className="tarjeta p-5 mt-5 font-texto text-sm">
      <h2 className="text-lg font-extrabold font-titulo">4. Cálculo paso a paso</h2>
      <p className="text-gris mt-1">Toca cada respuesta para cambiarla entre acierto y error. El estudiante empieza en el nivel 2.</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {resp.map((c, i) => (
          <button key={i} onClick={() => setResp((r) => r.map((v, j) => (j === i ? !v : v)))} aria-label={`Respuesta ${i + 1}: ${c ? "acierto" : "error"}`}
            className={`btn w-[92px] h-[72px] flex flex-col items-center justify-center text-sm ${c ? "bg-verde-claro text-verde-oscuro" : "bg-[#FFE1DA] text-[#C23B1E]"}`}>
            <span className="text-xl">{c ? "✓" : "✗"}</span><span className="text-[11px] font-semibold">{corto(PATRON_LECTURA[i])}</span>
          </button>
        ))}
      </div>
      <ol className="mt-4">
        {[
          ["1", "Respuestas en la ventana", `${resp.length} (una lectura completa)`],
          ["2", "Aciertos", `${aciertos}`],
          ["3", "Porcentaje de aciertos", `${aciertos} ÷ ${resp.length} = ${pc(aciertos / resp.length)}`],
          ["4", "Comparación con las reglas", `${aciertos / resp.length >= reglas.subir ? `≥ ${reglas.subir * 100} % → subir` : aciertos / resp.length <= reglas.bajar ? `≤ ${reglas.bajar * 100} % → bajar` : `entre ${reglas.bajar * 100} % y ${reglas.subir * 100} % → mantener`}`],
        ].map(([n, t, v]) => (
          <li key={n} className="grid grid-cols-[28px_1fr_auto] gap-3 items-center py-2.5 border-t border-[#EEE]">
            <span className="w-7 h-7 rounded-full bg-morado-claro text-morado font-bold text-xs flex items-center justify-center font-titulo">{n}</span>
            <span className="font-semibold">{t}</span><span className="font-bold tabular-nums text-right">{v}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 font-semibold">Decisión: <span style={{ color: colorAccion(d.accion) }}>{d.accion}</span> <span className="text-gris font-normal">(nivel 2 → {d.nivel})</span></p>
    </section>
  );
}

// Panel para demostrar el motor: pruebas automatizadas, simulador, registro real y cálculo paso a paso.
export default function PanelPruebas({ registro, onVolver }) {
  const [version, setVersion] = useState("v1");
  const reglas = version === "v1" ? REGLAS_V1 : REGLAS_V1_1;
  const [resultados, setResultados] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [secuencia, setSecuencia] = useState([true, true, false, true, true, true, true, true, true, false]);
  const [nivelIni, setNivelIni] = useState(2);
  const sim = useMemo(() => simularSesion(secuencia, nivelIni, reglas), [secuencia, nivelIni, reglas]);

  const correr = () => { setResultados(ejecutarTodos(reglas)); setFecha(new Date()); };
  const aprobadas = resultados?.filter((r) => r.ok).length;

  return (
    <div className="px-5 py-6 text-left max-w-4xl mx-auto">
      <button onClick={onVolver} className="text-sm font-semibold text-morado underline underline-offset-4">← Volver a la app</button>
      <h1 className="text-[26px] font-extrabold mt-3 leading-tight">Panel de pruebas del motor adaptativo</h1>
      <p className="text-gris font-texto mt-1">Ventana móvil de aciertos · HU-13 / RF-01 · Incremento del Sprint 1</p>

      <div className="flex gap-2 mt-4" role="radiogroup" aria-label="Versión del motor">
        {[["v1", "v1 · Sprint 1"], ["v1.1", "v1.1 · propuesta HU-13b"]].map(([v, l]) => (
          <button key={v} role="radio" aria-checked={version === v} onClick={() => { setVersion(v); setResultados(null); }}
            className={`btn px-4 h-11 text-sm ${version === v ? "bg-tinta text-white" : "bg-white border border-[#DDD]"}`}>{l}</button>
        ))}
      </div>
      <p className="font-texto text-sm mt-2 text-gris">
        Reglas: últimas {reglas.tamanoVentana} respuestas del nivel · sube con ≥ {reglas.subir * 100} % · baja con ≤ {reglas.bajar * 100} % · niveles {reglas.nivelMin} a {reglas.nivelMax}
        {reglas.exigirCadaHabilidad && " · para subir debe acertar al menos una pregunta de cada habilidad"}
      </p>

      <section className="tarjeta p-5 mt-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-extrabold">1. Pruebas automatizadas</h2>
          <button onClick={correr} className="btn-morado h-11 px-5 text-sm">▶ Ejecutar pruebas</button>
        </div>
        {!resultados && <p className="font-texto text-sm text-gris mt-3">Pulsa “Ejecutar pruebas” para correr los 7 casos sobre el motor real. Son los mismos casos que ejecuta <code>npm test</code>.</p>}
        {resultados && (
          <>
            <p className="mt-3 font-bold">
              <span className={aprobadas === resultados.length ? "text-verde-oscuro" : "text-[#B07D00]"}>{aprobadas} de {resultados.length} pruebas pasan</span>
              <span className="text-gris font-normal text-sm font-texto"> · {fecha.toLocaleString("es-PE")}</span>
            </p>
            <ul className="mt-2 divide-y divide-[#EEE]">
              {resultados.map((r) => (
                <li key={r.id} className="py-2 flex gap-3 items-start">
                  <span className={`chip shrink-0 ${r.ok ? "bg-verde-claro text-verde-oscuro" : "bg-[#FFE1DA] text-[#C23B1E]"}`}>{r.ok ? "PASA" : "FALLA"}</span>
                  <div className="font-texto text-sm"><b>{r.id}</b> {r.nombre} <span className="text-gris">({r.criterio})</span><br /><span className="text-gris">{r.detalle}</span></div>
                </li>
              ))}
            </ul>
            {version === "v1" && <p className="font-texto text-sm mt-2 bg-sol-claro rounded-xl p-3">T7 es la prueba añadida tras la Revisión del Sprint 1: <b>falla en v1</b> (sube de nivel aunque falle la única pregunta crítica) y <b>pasa en v1.1</b>. Cambia de versión arriba para comprobarlo.</p>}
          </>
        )}
      </section>

      <section className="tarjeta p-5 mt-5">
        <h2 className="text-lg font-extrabold">2. Simulador de sesión</h2>
        <p className="font-texto text-sm text-gris mt-1">Agrega respuestas y observa el porcentaje de aciertos de la ventana y las decisiones de nivel. Las habilidades siguen el orden de una lectura: literal, literal, inferencial, inferencial, crítica.</p>
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <button onClick={() => setSecuencia((s) => [...s, true])} className="btn h-11 px-4 bg-verde-claro text-verde-oscuro text-sm">+ Acierto ✓</button>
          <button onClick={() => setSecuencia((s) => [...s, false])} className="btn h-11 px-4 bg-[#FFE1DA] text-[#C23B1E] text-sm">+ Error ✗</button>
          <button onClick={() => setSecuencia([])} className="btn h-11 px-4 bg-white border border-[#DDD] text-sm">Reiniciar</button>
          <button onClick={() => setSecuencia(SECUENCIA_HALLAZGO)} className="btn h-11 px-4 bg-white border border-[#DDD] text-sm">Caso T7 ✓✓✓✓✗</button>
          <label className="text-sm font-texto ml-1">Nivel inicial{" "}
            <select value={nivelIni} onChange={(e) => setNivelIni(+e.target.value)} className="border rounded-lg px-2 py-1">{[1, 2, 3, 4, 5].map((v) => <option key={v}>{v}</option>)}</select>
          </label>
        </div>
        {secuencia.length > 0 ? (
          <>
            <p className="font-texto text-xs mt-3 flex gap-4 flex-wrap">
              <span><span className="inline-block w-3 h-3 rounded-sm bg-[#D8F3EA] align-middle mr-1" />Zona en que sube (≥ {reglas.subir * 100} %)</span>
              <span><span className="inline-block w-3 h-3 rounded-sm bg-[#FFE1DA] align-middle mr-1" />Zona en que baja (≤ {reglas.bajar * 100} %)</span>
              <span>Punto grande = ventana completa (se toma la decisión)</span>
            </p>
            <div className="mt-2"><Grafico traza={sim.traza} reglas={reglas} /></div>
            <TablaTraza traza={sim.traza} />
          </>
        ) : <p className="font-texto text-sm text-gris mt-3">Sin respuestas todavía.</p>}
      </section>

      <section className="tarjeta p-5 mt-5">
        <h2 className="text-lg font-extrabold">3. Registro de la sesión real</h2>
        <p className="font-texto text-sm text-gris mt-1">Cada primer intento que un estudiante responde en la app queda registrado aquí con la decisión del motor (v1).</p>
        {registro.length ? <div className="mt-3"><TablaTraza traza={registro} /></div>
          : <p className="font-texto text-sm mt-3 bg-morado-claro rounded-xl p-3">Aún no hay respuestas. Ingresa con el código <b>4B7K</b>, completa una lectura y vuelve a este panel.</p>}
      </section>

      <Calculadora reglas={reglas} />
    </div>
  );
}
