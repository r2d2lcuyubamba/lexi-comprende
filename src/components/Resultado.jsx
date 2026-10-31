import { Medalla } from "./Iconos.jsx";
import { HABILIDADES, porcentaje } from "../engine/motor.js";
import { NOMBRE_HABILIDAD } from "../data/lecturas.js";

// Cierre de la sesión: aciertos, monedas y decisión del motor adaptativo (HU-13).
const pctHab = (perfil, h) => porcentaje(perfil.motor.porHabilidad[h] || []);
export default function Resultado({ lectura, sesion, nivelAntes, perfil, onInicio, onPruebas }) {
  const cambios = perfil.registro.slice(-sesion.resultados.length).filter((e) => e.nivelDespues !== e.nivelAntes).length;
  const aciertos = sesion.resultados.filter((r) => r.primerIntento).length;
  const nivel = perfil.motor.nivel;
  const cambio = nivel > nivelAntes ? "sube" : nivel < nivelAntes ? "baja" : "igual";
  const mensaje = {
    sube: { t: `¡Subiste al Nivel ${nivel}!`, d: "Tus próximas lecturas serán un poco más largas y con más preguntas de “¿por qué?”." },
    baja: { t: `Practicaremos en el Nivel ${nivel}`, d: "Lexi te dará textos más cortos y más pistas para que sigas avanzando seguro." },
    igual: { t: `Sigues en el Nivel ${nivel}`, d: "¡Vas muy bien! Un poco más de práctica y subirás de nivel." },
  }[cambio];

  return (
    <div className="px-6 pt-6 pb-6 text-center">
      <div className="mx-auto w-40 h-40 rounded-full bg-morado-claro flex items-center justify-center"><Medalla s={100} /></div>
      <h1 className="text-[28px] font-extrabold mt-3">¡Lectura completada!</h1>
      <p className="text-gris">{lectura.titulo}</p>

      <div className="flex gap-3 mt-5">
        <div className="tarjeta flex-1 p-3.5"><p className="text-[28px] font-extrabold text-verde-oscuro">{aciertos}/{sesion.resultados.length}</p><p className="text-gris text-xs">aciertos al primer intento</p></div>
        <div className="tarjeta flex-1 p-3.5"><p className="text-[28px] font-extrabold text-[#B07D00]">+{sesion.monedas}</p><p className="text-gris text-xs">monedas</p></div>
      </div>

      <div className="mt-4 rounded-3xl p-5 text-left text-white" style={{ background: "linear-gradient(135deg,#5B3FD0,#8B6CF6)" }}>
        <p className="text-[13px] font-semibold opacity-85">LEXI AJUSTÓ TU CAMINO</p>
        <p className="text-[19px] font-extrabold mt-1">{mensaje.t}</p>
        <p className="text-[14px] opacity-90 mt-1">{mensaje.d}</p>
        {cambios > 0 && <p className="text-[12px] opacity-80 mt-2">Durante esta lectura el motor cambió tu nivel {cambios} {cambios === 1 ? "vez" : "veces"}.</p>}
      </div>

      <div className="tarjeta mt-4 p-4 text-left">
        <p className="font-bold text-sm">Tus aciertos por tipo de pregunta</p>
        {HABILIDADES.map((h) => (
          <div key={h} className="mt-2.5">
            <div className="flex justify-between text-xs font-semibold"><span>{NOMBRE_HABILIDAD[h]}</span><span>{pctHab(perfil, h) == null ? "—" : `${Math.round(pctHab(perfil, h) * 100)}%`}</span></div>
            <div className="h-2.5 bg-morado-claro rounded-full mt-1"><div className="h-full bg-morado rounded-full" style={{ width: `${(pctHab(perfil, h) || 0) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      <button onClick={onInicio} className="btn-sol mt-5 w-full h-16 text-[19px]">Volver al inicio</button>
      <button onClick={onPruebas} className="mt-4 text-sm font-semibold text-morado underline underline-offset-4">Ver cómo decidió el motor</button>
    </div>
  );
}
