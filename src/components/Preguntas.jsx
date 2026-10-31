import { useState } from "react";
import { NOMBRE_HABILIDAD } from "../data/lecturas.js";
import { Check, Moneda } from "./Iconos.jsx";

const COLOR_HAB = { literal: "bg-verde-claro text-verde-oscuro", inferencial: "bg-morado-claro text-morado", critica: "bg-coral-claro text-[#B04A2E]" };

// HU-05 · RF-02: retroalimentación inmediata (< 1 s), pista que remite al texto y segundo intento.
// Solo el PRIMER intento se envía al motor (onRespuesta): el segundo ya está ayudado por la pista.
export default function Preguntas({ lectura, nombre, onRespuesta, onTerminar, onSalir }) {
  const [n, setN] = useState(0);
  const [intento, setIntento] = useState(1);
  const [elegida, setElegida] = useState(null);
  const [estado, setEstado] = useState("respondiendo"); // respondiendo | pista | final
  const [resultados, setResultados] = useState([]);
  const [monedasSesion, setMonedasSesion] = useState(0);
  const q = lectura.preguntas[n];

  const responder = (i) => {
    if (estado === "final") return;
    const correcta = i === q.correcta;
    setElegida(i);
    if (intento === 1) {
      onRespuesta(q.habilidad, correcta); // ← entra a la ventana de aciertos
      setResultados((r) => [...r, { habilidad: q.habilidad, primerIntento: correcta }]);
      if (correcta) { setMonedasSesion((m) => m + 10); setEstado("final"); }
      else setEstado("pista");
    } else {
      if (correcta) setMonedasSesion((m) => m + 5);
      setEstado("final");
    }
  };

  const reintentar = () => { setIntento(2); setElegida(null); setEstado("respondiendo"); };
  const siguiente = () => {
    if (n + 1 < lectura.preguntas.length) { setN(n + 1); setIntento(1); setElegida(null); setEstado("respondiendo"); }
    else onTerminar({ resultados, monedas: monedasSesion });
  };

  const acerto = elegida === q.correcta;
  const estiloOpcion = (i) => {
    if (estado === "respondiendo") return "bg-white shadow-[0_4px_0_#E2DCD0]";
    if (i === elegida && acerto) return "bg-verde text-white shadow-[0_4px_0_#168060]";
    if (i === elegida && !acerto) return "bg-coral-claro border-[3px] border-coral";
    if (estado === "final" && i === q.correcta) return "bg-verde-claro border-[3px] border-verde";
    return "bg-white shadow-[0_4px_0_#E2DCD0] opacity-55";
  };

  return (
    <div className="px-5 pt-3 pb-6 text-left">
      <div className="flex items-center justify-between">
        <button onClick={onSalir} className="text-2xl font-extrabold w-12 h-12" aria-label="Salir">✕</button>
        <span className="font-bold">Pregunta {n + 1} de {lectura.preguntas.length}</span>
        <span className="chip bg-white shadow-[0_2px_0_#E2DCD0]"><Moneda /> +{monedasSesion}</span>
      </div>
      <div className="flex gap-1.5 mt-1">
        {lectura.preguntas.map((_, i) => (
          <div key={i} className={`flex-1 h-2.5 rounded-full ${i < resultados.length ? (resultados[i].primerIntento ? "bg-verde" : "bg-coral") : "bg-[#E2DCD0]"}`} />
        ))}
      </div>

      <span className={`chip mt-5 ${COLOR_HAB[q.habilidad]}`}>{NOMBRE_HABILIDAD[q.habilidad]}</span>
      <h2 className="text-[22px] font-extrabold leading-snug mt-3">{q.pregunta}</h2>

      <div className="flex flex-col gap-3 mt-5" role="group" aria-label="Opciones de respuesta">
        {q.opciones.map((op, i) => (
          <button key={i} onClick={() => responder(i)} disabled={estado !== "respondiendo"}
            className={`btn min-h-16 px-4 py-3 text-left text-[17px] flex items-center justify-between disabled:opacity-100 disabled:cursor-default ${estiloOpcion(i)}`}>
            {op} {estado !== "respondiendo" && i === elegida && acerto && <Check />}
          </button>
        ))}
      </div>

      {estado === "pista" && (
        <div className="mt-5 bg-sol-claro border-2 border-[#F5B82E] rounded-3xl p-4" role="status">
          <p className="font-extrabold text-[#8A5A00] text-lg">¡Casi! Intenta otra vez</p>
          <p className="font-texto text-[16px] leading-relaxed mt-1.5"><b>Pista:</b> {q.pista}</p>
          <button onClick={reintentar} className="btn-morado mt-3 w-full h-14 text-[16px]">Intentar de nuevo</button>
        </div>
      )}

      {estado === "final" && (
        <div className={`mt-5 rounded-3xl p-4 border-2 ${acerto ? "bg-verde-claro border-verde" : "bg-morado-claro border-morado"}`} role="status">
          <p className={`font-extrabold text-lg ${acerto ? "text-verde-oscuro" : "text-morado"}`}>
            {acerto ? (intento === 1 ? `¡Muy bien, ${nombre}!` : "¡Lo lograste con la pista!") : "Revisemos juntos"}
          </p>
          <p className="font-texto text-[16px] leading-relaxed mt-1.5">{q.explicacion}</p>
          <button onClick={siguiente} className="btn-morado mt-4 w-full h-14 text-lg">{n + 1 < lectura.preguntas.length ? "Siguiente →" : "Ver mi resultado"}</button>
        </div>
      )}
    </div>
  );
}
